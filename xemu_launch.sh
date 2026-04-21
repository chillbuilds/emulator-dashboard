#!/bin/bash

XEMU_PATH="/home/will/software/games/xemu/xemu.AppImage"
GAME_PATH="/home/will/software/games/xemu/games/"

# Check if ISO argument was provided
if [ -z "$1" ]; then
    echo "No ISO specified. Usage: '$0 game_name'"
else
    ISO_PATH="$1"
    "$XEMU_PATH" "-full-screen" "-dvd_path" "$GAME_PATH""$ISO_PATH"".xiso.iso"
fi
