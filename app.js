// app.js
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Bot is ready');
});

client.on('message', (msg) => {
    if (msg.author.id != '493390056573370389' && msg.content.startsWith('!')) {
        let parts = msg.content.split(' ');
        if(parts.length > 0) {
            let resolution = intentMap(parts);
            msg.reply(resolution.msg);
        } else {
            msg.reply('fail');
        }
    }
});

client.login(process.env.BOT_TOKEN);

function intentMap(args) {
    switch (args[0]) {
        case '!list':
            let command = args[0] ?? -1;
            if (command != -1 && command.length > 1) {
                if(args[1] == 'add') {
                    return addGameToList(args.splice(2, args.length).join(' '));
                } else if (args[1] == 'remove') {
                    return {
                        success: true,
                        msg: 'No implementado'
                    };
                } else if (args[1] == 'show') {
                    return showList();
                } else if (args[1] == 'random') {
                    return getRandomGame();
                } else {
                    return { 
                        success: false, 
                        msg: 'Uso del comando: !list <comando>'
                    };
                }
            } else {
                return { 
                    success: false, 
                    msg: 'Uso del comando: !list <comando>'
                };
            }
        default:
            return {
                success: false,
                msg: 'Comando no reconocido'
            };
    }
}

function addGameToList(game) {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        list.push(game);
        fs.writeFileSync('game_list.json', JSON.stringify(list));
        return {
            success: true,
            msg: `${game} añadido a la lista`
        };
    } catch(e) {
        return {
            success: false,
            msg: `Error al añadir juego`
        };
    }
}

function showList() {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        let msg = '\n';
        for (let game of list) {
            msg += `${game}\n`;
        }
        return {
            success: true,
            msg: msg
        };
    } catch(e) {
        return {
            success: false,
            msg: `Error al mostrar lista`
        };
    }
}

function getRandomGame() {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        let game = list[getRandomInt(0, list.length)];
        return {
            success: true,
            msg: game
        };
    } catch(e) {
        return {
            success: false,
            msg: `Error al mostrar lista`
        };
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}