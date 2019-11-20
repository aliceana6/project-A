const { Collection } = require('discord.js')
const { readdirSync, readdir } = require('fs');
const DIR = 'commands';
const CommandLoader = require('../cmd/CommandLoader.js');
const Command = require('../cmd/Command.js');

module.exports = class CommandsLoader extends CommandLoader {
	constructor(client){
		super(client)
			this.ProjectV = client;
			this.ProjectV.commands = {
				all: new Collection(),
				categories: [],
				load: ( cmd ) => await this.CommandLoad(cmd)
		}
	}
	async call(){
		return this.ViewCommands().then(() => console.log('[COMMANDS] All commands loaded with sucess'))
	}
	async ViewCommands(dirPath = DIR, array = []){
		const folders = await readdirSync(dirPath);
		if(folders){
			await Promise.all(folders.map(folder => {
				this.ProjectV.commands.categories.push({
					size: 0,
					name: folder
				});
				readdir((`${dirPath}/${folder}`), async (err, files, numFile = 0, arr = []) => {
					if(!files || err) return;
					while(files.length > numFile){
						const file = files[numFile]
						array_content.push( { fileName: file, fileFolder: folder } )
						++numFile 
					}
					return this.pushCommands(arr)
				})
			}))
			return true;
		}
	}
	async pushCommands(files){
		for(const file of files){
			if(file.fileName.endsWith('.js')){
				this.addCommand( { file: file.fileName, dir: (`${dir}/${file.fileFolder}/${file.fileName}`), folder: file.fileFolder } )
			}
		}
		return true;
	}
	async addCommand({ file, dir, folder }, error = false){
		if(file.endsWith('.js')){
			try {
				await require(`../../${dir}`);
			} catch (err){
				error = true
				console.error(err)
			} finally {
				if(!error){
					try {
						const required = require(`../../${dir}`);
						const command = new required(this.ProjectV);
						if(!(command instanceof Command)) return console.log('[COMMANDS] Not an command')

							++this.ProjectV.commands.categories.find( ( { name } ) => (
									name === folder 
								)).size 

						return this.ProjectV.commands.all.set(command.settings.name, {
							help: command.settings ,
							directory: dir
						})
					} catch (err){
						console.error(err)
					}
				}
			}
		}
		return true;
	}
}