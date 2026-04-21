let selectionIndex = 0
let gameCount;

let cursorVisible = false
document.documentElement.style.cursor = 'none'

const socket = io()

if(localStorage.getItem('selectionIndex')){
    selectionIndex = localStorage.getItem('selectionIndex')
}

let updateSelectedGame = () => {

    localStorage.setItem('selectionIndex', selectionIndex)

    $($('.selected')[0]).removeClass('selected')
    $($('.game')[selectionIndex]).addClass('selected')

    $('.selected')[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    })

    $('#game-title').text($($('.game')[selectionIndex]).attr('gameTitle'))
}

let toggleCursor = () => {
    if(cursorVisible){
        document.documentElement.style.cursor = 'none'
        cursorVisible = false
    }else{
        document.documentElement.style.cursor = 'default'
        cursorVisible = true
    }
}

let launchGame = () => {
    const selectedGame = $($('.selected')[0]).attr('gameTitle')

    fetch('/launch-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: selectedGame
    })
    .catch(err => console.error(err))
}

let inputRight = () => {
    if(selectionIndex < gameCount - 1){
            selectionIndex++
    }else{
        selectionIndex = 0
    }
    updateSelectedGame()
}

let inputLeft = () => {
    if(selectionIndex > 0){
        selectionIndex--
    }else{
        selectionIndex = gameCount - 1
    }
    updateSelectedGame()
}

let inputUp = () => {
    const columns = 5

    if (selectionIndex >= columns) {
        selectionIndex -= columns
    } else {
        const column = selectionIndex % columns
        const lastRowStart = Math.floor((gameCount - 1) / columns) * columns
        const target = lastRowStart + column

        selectionIndex = target < gameCount ? target : target - columns
    }
    updateSelectedGame()
}

let inputDown = () => {
    const columns = 5

    if (selectionIndex + columns < gameCount) {
        selectionIndex += columns
    } else {
        const column = selectionIndex % columns
        selectionIndex = column
    }

    updateSelectedGame()
}

fetch('/game-list')
.then(res => res.json())
.then(gameList => {
    console.log(gameList)
    gameList.forEach(game => {
        $('#game-list').append(`
            <div class="game" gameTitle="${game}">
                <img class="box-art" src="/images/box-art/${game}.avif" onerror="this.src='/images/box-art/default.png'">
            </div>
        `)
    })
    gameCount = $('.game').length

    $('#game-list').append(`
        <div style=" position:relative; float:left; padding:5%;"></div>
    `)

    updateSelectedGame()
})

$('#game-list').on('click', '.game', function () {

    const selectedGame = $(this).attr('gameTitle')

    console.log(selectedGame)

    fetch('/launch-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: selectedGame
    })
    .catch(err => console.error(err))
})

socket.on('controller-data', (data) => {

    console.log('input received:', data)

    switch(data) {
        case 'right':
            inputRight()
            break;
        case 'left':
            inputLeft()
            break;
        case 'up':
            inputUp()
            break;
        case 'down':
            inputDown()
            break;
        case 'a':
            launchGame()
            break;
        case 'connected':
            $('#controller-icon-image').attr('src', './images/icons/controller-connected.svg')
            $('#controller-icon').attr('style', 'opacity: 1.0;')
            break;
        case 'disconnected':
            $('#controller-icon-image').attr('src', './images/icons/controller.svg')
            $('#controller-icon').attr('style', 'opacity: 0.2;')
            break;
        case 'cursor-toggle':
            toggleCursor()
            break;
        default:
            break;
    }
})

$(document).ready(()=>{
    $(document).keypress(function (event) {
        console.log(event.key)
        if(event.key == 'd'){
            inputRight()
        }
        if(event.key == 'a'){
            inputLeft()
        }
        if(event.key == 'w'){
            inputUp()
        }
        if(event.key == 's'){
            inputDown()
        }
        if(event.key == 'Enter'){
            launchGame()
        }
        if(event.key == ' '){
            toggleCursor()
        }
        $('#game-title').text($($('.game')[selectionIndex]).attr('gameTitle'))

    })
})