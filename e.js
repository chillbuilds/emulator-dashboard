import express from 'express'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import {internalIpV4 } from 'internal-ip'
import { Server } from 'socket.io'
import http from 'http'
import ps from 'ps-node'
import { controllerConnect } from './controllers.js'
import { fetchEmulatorList } from './emulator-list.js'

setInterval(() => {
  ps.lookup({
    command: 'xemu.AppImage',
    }, function(err, resultList ) {
    if(err){
      console.log(err)
    }
    if(resultList.length){
      resultList.forEach(function( process ){
        if( process ){
            gameRunState.gameRunning = true
            // console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments )
        }
      })
    }else{
      gameRunState.gameRunning = false
    }
  })
}, 1000)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const ipAddress = await internalIpV4()
const port = process.env.PORT || 3002

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.text())

const server = http.createServer(app)
const io = new Server(server)

const gameDir = '/home/will/software/games/emulators/xemu/games/'
const boxArtDir = '/home/will/software/games/emulators/xemu/box-art/'

const gameRunState = {
  gameRunning: false
}

let gameList = fs.readdirSync(gameDir)

gameList.forEach((game, index) => {
    gameList[index] = gameList[index].split('.xiso.iso').join('')
})

let emulatorList = fetchEmulatorList()
// copy emulator icons to public folder
emulatorList.forEach(emulator => {
  try{
    fs.copyFileSync(emulator.icon, './public/images/consoles/' + emulator.type + '.png')
  }catch(error){
    console.log(error)
  }

  let boxArt = fs.readdirSync(emulator.boxArtDir)
  console.log(boxArt)
  boxArt.forEach(image => {
    fs.copyFileSync(boxArtDir + image, './public/images/box-art/' + emulator.type + '/' + image)
  })
})

gameList.forEach((game, index) => {
    gameList[index] = gameList[index].split('.xiso.iso').join('')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/emulator-list', (req, res) => {
  let formattedList = []
  emulatorList.forEach(emulator => {
    let emulatorObj = {
      type: emulator.type,
      emulator: emulator.emulator
    }
    console.log(emulatorObj)
    formattedList.push(emulatorObj)
  })
  res.send(JSON.stringify(formattedList))
})

app.get('/game-list', (req, res) => {
  res.send(JSON.stringify(gameList))
})

app.post('/launch-game', (req, res) => {

  // if(gameRunState.gameRunning) return

  gameRunState.gameRunning = true
  const gameSelection = req.body

  let child = spawn('/home/will/software/games/emulators/xemu/xemu_launch.sh', [gameSelection], { stdio: 'inherit' })

  child.on('error', console.error)
})

server.listen(port, () => {
  console.log('http://' + ipAddress + ':' + port)
})

io.on('connection', (socket) => {
  console.log('frontend connected')

  controllerConnect(io, gameRunState)
})