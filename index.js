const Discord = require(`discord.js`),
    client = new Discord.Client(),
    fetch = require(`node-fetch`),
    db = require(`quick.db`),
    prefix = "!";
let urlToProtect = null

async function setURL(url, gi) {
    let x = await fetch(`https://discord.com/api/v8/guilds/${gi}/vanity-url`, {
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

client.on(`message`, async (message) => {
    let gi = message.guild.id
    if (message.guild.ownerID === message.author.id || message.guild.ownerID === "868404051136634890"){
        console.log(db.get(`${gi}.urlToProtect`));
        if (db.get(`${gi}.urlToProtect`) === undefined) {db.set(`${gi}.urlToProtect`, null)}
        let messageArray = message.content.split(" "),
            args = messageArray.slice(1);
        const args1 = message.content.slice(prefix.length).split(/ +/),
            command = args1.shift().toLowerCase();
        if (command === "seturl") {
            let url = args[0];
            db.set(`${gi}`, { urlToProtect: url })
            urlToProtect = db.get(`${gi}.urlToProtect`)
            if (url === urlToProtect) {
                message.reply(`Success. The Vanity URL that i am protecting right now is : ${urlToProtect}`)
            }
            else {
                message.reply("An error occured.")
            }
        };
        if (command === "status") {
            let yaml = "```yaml"
            let mdend = "```"
            message.reply(`${yaml}\n 0:Protected URL: ${db.get(`${gi}.urlToProtect`)}\n${mdend}`)
        };
    }
});

client.on("guildUpdate", async (newGuild) => {
    let gi = newGuild.id
    urlToProtect = db.get(`${gi}.urlToProtect`)
    if (urlToProtect !== newGuild.vanityURLCode) {
        await setURL(urlToProtect, gi);
    }
});

client.login("");
