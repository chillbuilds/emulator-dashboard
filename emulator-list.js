export function fetchEmulatorList(){

    return [
        {
            type: 'xbox',
            emulator: 'xemu.AppImage',
            location: '/home/will/software/games/emulators/xemu/',
            gameDir: '/home/will/software/games/emulators/xemu/games/',
            boxArtDir: '/home/will/software/games/emulators/xemu/box-art/',
            icon: '/home/will/software/games/emulators/xemu/icon.png'
        },
        {
            type: 'n64',
            emulator: 'gopher64',
            location: '/home/will/software/games/emulators/gopher64/',
            gameDir: '/home/will/software/games/emulators/gopher64/games/',
            boxArtDir: '/home/will/software/games/emulators/gopher64/box-art/',
            icon: '/home/will/software/games/emulators/gopher64/icon.png'
        },

    ]
}