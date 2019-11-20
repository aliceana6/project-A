const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = class ListenersLoader {
	constructor(client){
		this.ProjectV = client;
		this.ProjectV.events = new Collection()
	}
	async call(){
		return this.LoaderEvents().then(() => console.log('[LISTENERS] Loaded sucessfully all listeners'))
	}
	async LoaderEvents(evtPath = 'listeners'){
		const files = await readdirSync(evtPath)
		return Promise.all(files.map(async evt => {
				const required = require('../../listeners/' + evt);
				delete require.cache[require.resolve(required)];
				const event = new required(this.ProjectV)
				if(Array.isArray(event.name)) {
					event.name.forEach(listener => this.ProjectV.on(listener, (...args) => event['on' + listener.charAt(0).toUpperCase() + listener.slice(1)](...args)))
				} else {
					this.ProjectV.on(event.name, (...args) => event['on' + event.name.charAt(0).toUpperCase() + event.name.slice(1)])
				}
			})
		);
	}
}