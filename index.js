const Discord = require('discord.js')
const client = new Discord.Client()
const express = require('express')

let purrs = [
	'https://orangefreesounds.com/wp-content/uploads/2020/02/Meowing-cat-sound.mp3',
	'https://orangefreesounds.com/wp-content/uploads/2019/10/Original-cat-sound.mp3',
	'https://orangefreesounds.com/wp-content/uploads/2019/09/Cat-noise.mp3',
	'https://orangefreesounds.com/wp-content/uploads/2014/07/Cat-meow-sound-2.mp3',
	'https://orangefreesounds.com/wp-content/uploads/2014/06/Cat-meow-sounds.mp3',
]

let broadcast

function doPurr() {
	if (Math.random() < 0.5) {
		setTimeout(doPurr, 5000)
		return
	}
	try {
		const dispatch = broadcast.play(purrs[Math.floor(Math.random() * purrs.length)])
		dispatch.setVolume(0.1)
		dispatch.on('finish', () => setTimeout(doPurr, 5000))
	} catch (err) { console.log(err) }
}

function channelsChange() {
	console.log('channel change!')
	client.guilds.cache.forEach((g) => {
		let channels = []
		g.channels.cache.forEach((chan) => {
			if (chan.type !== 'voice') {return}
			try { chan.leave() } catch (err) { console.log(err) }
			if (chan.joinable) channels.push(chan)
		})
		if (channels.length == 0) {return}
		if (Math.random() < 0.7) {return}
		let chan = channels[Math.floor(Math.random() * channels.length)]
		chan.join()
		.then(connection => {
			console.log('connected to ' + chan.name + ' in ' + g.name)
			connection.play(broadcast) 
		})
		.catch(console.log)
		if (g.voice && g.voice.setMute)
			g.voice.setMute(false)
	})
}

client.on('ready', () => {
	broadcast = client.voice.createBroadcast()
	doPurr()
	channelsChange()
	setInterval(channelsChange, 60000)
})

client.on('message', async (msg) => {
	if (msg.mentions.users.array().includes(client.user))
		await msg.react('😻')
})

client.login(process.env.DISCORD_TOKEN)

// dirty hack for heroku
var app = express()
app.listen(process.env.PORT || 5000)
