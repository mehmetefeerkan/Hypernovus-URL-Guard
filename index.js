const Discord = require('discord.js'),
    client = new Discord.Client(),
    moment = require("moment-timezone"),
    fetch = require('node-fetch'),
    delay = require('delay'),
    db = require('quick.db'),
    guildID = "812618443664654346",
    prefix = "!";
let urlToProtect = db.get('urlToProtect.urlToProtect')

let urlTried = 0

async function setURL(url) {
    let x = await fetch(`https://discord.com/api/v8/guilds/${guildID}/vanity-url`, {
        "credentials": "include",
        "headers": {
            "accept": "*/*",
            "authorization": "Bot " + client.token,
            "content-type": "application/json",
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({
            "code": url
        }),
        "method": "PATCH",
        "mode": "cors"
    });
    return
}

async function tryGettingURL() {
    if ((db.get("askForUrl.askForUrl")) === true) {
        urlTried++
        let x = await fetch(`https://discord.com/api/v8/guilds/${guildID}/vanity-url`, {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "authorization": "Bot " + client.token,
                "content-type": "application/json",
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": JSON.stringify({
                "code": db.get("urlGuard.urlToAskFor")
            }),
            "method": "PATCH",
            "mode": "cors"
        })
        let headers = x.headers
        let ratelimitLimit = 10
        let ratelimitTries = headers.get('x-ratelimit-remaining')
        let ratelimitResetTime = parseInt((headers.get('x-ratelimit-reset-after').toString())) * 1000
        let ratelimitIdealReqInterval = (parseInt(((ratelimitResetTime / ratelimitTries).toString())))
        if (x.status === 429){
            console.log("Waiting for : " + (ratelimitResetTime));
            await delay(ratelimitResetTime)
            tryGettingURL()
        }
        else {
            console.log("RPS :  " + ratelimitIdealReqInterval)
            console.log("Waiting for : " + (ratelimitIdealReqInterval));
            await delay(ratelimitIdealReqInterval)
            tryGettingURL()
        }
    }

}


client.on('message', async (message) => {
    let messageArray = message.content.split(" "),
        args = messageArray.slice(1);
    const args1 = message.content.slice(prefix.length).split(/ +/),
        command = args1.shift().toLowerCase();
    if (command === "seturl") {
        let url = args[0];
        db.set('urlToProtect', { urlToProtect: url })
        urlToProtect = db.get('urlToProtect.urlToProtect')
        if (url === urlToProtect){
            message.reply(`Success. The Vanity URL that i am protecting right now is : ${urlToProtect}`)
        }
        else {
            message.reply("An error occured.")
        }
    };
    if (command === "startus") {
        let url = args[0];
        db.set('askForUrl', { askForUrl: true })
        db.set('urlToAskFor', { urlToAskFor: url })
        if ((db.get('askForUrl.askForUrl') === true) && (db.get('urlToAskFor.urlToAskFor')) === url){
            message.reply(`Success. The Vanity URL that i am targeting right now is : ${url}`)
        }
        else {
            message.reply("An error occured.")
        }
    };
    if (command === "stopus") {
        db.set('askForUrl', { askForUrl: false })
        if (db.get('askForUrl.askForUrl') === false){
            message.reply(`I stopped targeting the URL ${db.get('urlToAskFor.urlToAskFor')}`)
        }
    };
    if (command === "showus") {
        let astrph = "`"
        message.reply(`URL that i am processing right now is ${astrph} .gg/${db.get("urlToAskFor.urlToAskFor")} ${astrph}. I have tried taking the url ${urlTried} times.`)
    };
});

client.on("guildUpdate", async (oldGuild, newGuild) => {
    urlToProtect = db.get('urlToProtect.urlToProtect')
    if (urlToProtect !== newGuild.vanityURLCode) {
        await setURL(urlToProtect);
    }
});

client.login("TOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKENTOKEN");
tryGettingURL()
