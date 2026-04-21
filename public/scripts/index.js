let selectionIndex = 0
let emulatorCount;

let cursorVisible = false
document.documentElement.style.cursor = 'none'

// const socket = io()

// if(localStorage.getItem('selectionIndex')){
//     selectionIndex = localStorage.getItem('selectionIndex')
// }

let updateSelectedEmulator = () => {

    localStorage.setItem('selectionIndex', selectionIndex)

    $($('.selected')[0]).removeClass('selected')
    $($('.emulator')[selectionIndex]).addClass('selected')

    $('.selected')[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    })

    $('#emulator-title').text($($('.emulator')[selectionIndex]).attr('emulatorTitle'))
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

let launchEmulator = () => {
    const selectedEmulator = $($('.selected')[0]).attr('emulatorTitle')

    console.log(selectedEmulator)

    window.location.href = `/${selectedEmulator}`
}

let inputRight = () => {
    if(selectionIndex < emulatorCount - 1){
            selectionIndex++
    }else{
        selectionIndex = 0
    }
    updateSelectedEmulator()
}

let inputLeft = () => {
    if(selectionIndex > 0){
        selectionIndex--
    }else{
        selectionIndex = emulatorCount - 1
    }
    updateSelectedEmulator()
}

let inputUp = () => {
    const columns = 5

    if (selectionIndex >= columns) {
        selectionIndex -= columns
    } else {
        const column = selectionIndex % columns
        const lastRowStart = Math.floor((emulatorCount - 1) / columns) * columns
        const target = lastRowStart + column

        selectionIndex = target < emulatorCount ? target : target - columns
    }
    updateSelectedEmulator()
}

let inputDown = () => {
    const columns = 5

    if (selectionIndex + columns < emulatorCount) {
        selectionIndex += columns
    } else {
        const column = selectionIndex % columns
        selectionIndex = column
    }

    updateSelectedEmulator()
}

fetch('/emulator-list')
.then(res => res.json())
.then(emulatorList => {
    console.log(emulatorList)
    emulatorList.forEach(emulator => {
        $('#emulator-list').append(`
            <div class="emulator" emulatorTitle="${emulator.type}">
                <img class="emulator-icon" src="/images/consoles/${emulator.type}.png" onerror="this.src='/images/box-art/default.png'">
            </div>
        `)
    })
    emulatorCount = $('.emulator').length

    $('#emulator-list').append(`
        <div style=" position:relative; float:left; padding:5%;"></div>
    `)

    updateSelectedEmulator()
})

// socket.on('controller-data', (data) => {

//     console.log('input received:', data)

//     switch(data) {
//         case 'right':
//             inputRight()
//             break;
//         case 'left':
//             inputLeft()
//             break;
//         case 'up':
//             inputUp()
//             break;
//         case 'down':
//             inputDown()
//             break;
//         case 'a':
//             launchEmulator()
//             break;
//         case 'connected':
//             $('#controller-icon-image').attr('src', './images/icons/controller-connected.svg')
//             $('#controller-icon').attr('style', 'opacity: 1.0;')
//             break;
//         case 'disconnected':
//             $('#controller-icon-image').attr('src', './images/icons/controller.svg')
//             $('#controller-icon').attr('style', 'opacity: 0.2;')
//             break;
//         case 'cursor-toggle':
//             toggleCursor()
//             break;
//         default:
//             break;
//     }
// })

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
            launchEmulator()
        }
        if(event.key == ' '){
            toggleCursor()
        }
        $('#emulator-title').text($($('.emulator')[selectionIndex]).attr('emulatorTitle'))
    })
})