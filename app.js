// app.js
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Bot is ready');
});

client.on('message', (msg) => {
    if (msg.author.id != process.env.SELF_ID && msg.content.startsWith('!')) {
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
            return parseListIntent(args.splice(1, args.length));
        case '!help':
            if(args.length == 1) return buildHelp();
            return writeMsg(false, 'Uso del comando: !help');
        default:
            return writeMsg(false, 'Comando no reconocido. Prueba !help para ver la lista de comandos');
    }
}

function buildHelp() {
    let msg = `Lista de comandos:
    !list
    ---- !list add <juegp>
    ---- !list delete <id de juego>
    ---- !list show
    ---- !list random`;
    return writeMsg(true, msg);
}

function parseListIntent(args) {
    switch(args[0]) {
        case 'add':
            let gameName = args.splice(1, args.length).join(' ').trim();
            if (gameName.length > 0) return addGameToList(gameName);
            return errorMsg('Uso del comando: !list delete <índice>');
        case 'delete':
            try {
                let listIndex = parseInt(args[1]) - 1;
                if (args.length == 2) return deleteGame(listIndex);
            } catch (e) {
                return errorMsg('Uso del comando: !list delete <índice>');
            }
            break;
        case 'show':
            return showList();
        case 'random':
            return getRandomGame();
        default:
            return writeMsg(false, `<${args[0]}> no se reconoce como comando de !list`);
    }
}

function addGameToList(game) {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        list.push(game);
        fs.writeFileSync('game_list.json', JSON.stringify(list));
        return writeMsg(true, `${game} añadido a la lista`);
    } catch(e) {
        return writeMsg(false, 'Error al añadir juego');
    }
}

function deleteGame(index) {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        let deletedGame = list.splice(index, 1);
        fs.writeFileSync('game_list.json', JSON.stringify(list));
        return writeMsg(true, `${deletedGame} borrado`);
    } catch(e) {
        return writeMsg(false, 'Error al borrar juego');
    }
}

function showList() {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        let msg = '\n';
        for (let i in list) msg += `${parseInt(i) + 1}). ${list[i]}\n`;
        return writeMsg(true, msg);
    } catch(e) {
        return writeMsg(false, 'Error al mostrar lista');
    }
}

function getRandomGame() {
    try {
        let rawList = fs.readFileSync('game_list.json');
        let list = JSON.parse(rawList);
        let game = list[getRandomInt(0, list.length)];
        return writeMsg(true, game);
    } catch(e) {
        return writeMsg(true, 'Error al mostrar un juego randomizado');
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function writeMsg(success, msg) {
    return {
        success: success,
        msg: msg
    };
}
