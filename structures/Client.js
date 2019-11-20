const { Client } = require('discord.js');
const Modules = require('./loaders/')

module.exports = class ProjectV extends Client {
	constructor(settings = {}){
		super(settings);
	}
	async initializeLoaders(){
		const Loaders = Object.values(Modules);
		const loadeds = 0;
		for(const loader of Loaders){
			const required = new loader(this);
			try {
				await required.call();
				++loadeds;
			} catch (e){
				console.error(e)
			}
		}
		return console.log(`[INITIALIZER] I sucessfully loaded ${loadeds} modules from ${Loaders.length}.`)
	}
	async connect(token = false){
		token = token ? token : process.env.TOKEN ? process.env.TOKEN : new Error('No token especified!');
		await this.initializeLoaders();
		return super.login(token)
	}
}