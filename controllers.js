import Joystick from 'joystick'
import fs from 'fs'
import ps from 'ps-node'

let controller = null
let reconnecting = false
let connectAttempt = false

export function controllerConnect(io, gameRunState){

    const reconnect = () => {
        if(reconnecting) return
        reconnecting = true

        if(controller){
            controller.removeAllListeners()
            controller = null
        }

        setTimeout(() => {
            reconnecting = false
            controllerConnect(io, gameRunState)
        }, 1000)
    }

    try{
        controller = new Joystick(0, 3500, 350)

        if(fs.existsSync('/dev/input/js0')){
            io.emit('controller-data', 'connected')
            console.log('controller connected')
            connectAttempt = false
        }else{
            io.emit('controller-data', 'disconnected')
        }

        controller.on('button', data => {

            if(data.init) return

            console.log(data)

            if(data.number == 0 && data.value == 1){
                io.emit('controller-data', 'a')
            }
            if(data.number == 4 && data.value == 1){
                io.emit('controller-data', 'cursor-toggle')
            }
            if(data.number == 8){
                ps.lookup({
                    command: 'xemu.AppImage',
                    }, function(err, resultList){
                    if(err){
                      console.log(err)
                    }
                    resultList.forEach(function(process){
                    if(process){
                        ps.kill(process.pid, function(err){
                            if(err){
                                console.log(err)
                            }else{
                                console.log('xemu has been killed')
                            }
                        })
                    }
                    })
                })
            }
        })

        controller.on('axis', data => {
            if(data.init || gameRunState.gameRunning) return

            console.log(data)

            if(data.number == 0 && data.value >= 32600){
                io.emit('controller-data', 'right')
            }
            if(data.number == 0 && data.value <= -32600){
                io.emit('controller-data', 'left')
            }
            if(data.number == 1 && data.value >= 32600){
                io.emit('controller-data', 'down')
            }
            if(data.number == 1 && data.value <= -32600){
                io.emit('controller-data', 'up')
            }
        })

        controller.on('error', (err) => {
            if(!connectAttempt){
                console.log('controller not found')
                io.emit('controller-data', err)
                connectAttempt = true
            }
            reconnect()
        })

    }catch(err){
        console.log('failed to connect:', err.message)
        reconnect()
    }
}