const Command = require('./Command.js');

module.exports = class {
	constructor(client){
		this.ProjectV = client;
	}
	async CommandLoad(cmd, dir = cmd.directory){
		let ocurred = ( { error: false, errorEmit: false } );
		delete require.cache[require.resolve(`../../${dir}`)];
		try {
			await require(`../../${dir}`);
		} catch (e){
			ocurred.error = true, ocurred.errorEmit = e;
			return ocurred;
		}
		this.ProjectV.commands.all.delete(cmd.help.name);
		const required = require(`../../${dir}`);
		const command = new required(this.ProjectV);

		if(!(command instanceof Command)) {
			ocurred.error = true, ocurred.errorEmit = 'Não é um Comando!'
			return ocurred;
		}
		this.ProjectV.commands.all.set(command.settings.name, {
			help: command.settings,
			commandHelp: command,
			directory: dir 
		})
		return ocurred;
	}
}