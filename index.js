const fs = require('fs');
const { exec, execSync } = require('child_process');

const packagesNams = process.argv[3];
const dirName =  process.argv[2];

fs.readdir(dirName, (err, dirs) => {
	if (err) {
		return console.error(err);
	};

	dirs.map(i => {
		fs.readdir(`${dirName}\\${i}\\`, (err, files) => {
			if (files === undefined) {
				return false;
			}
			
			if (files.indexOf('yarn.lock') !== -1 ) {
				process.chdir(`${dirName}\\${i}\\`);
				const pak = require(`${dirName}\\${i}\\package.json`);

				packagesNams.split(',').map(packageName => {
					if(pak.dependencies === undefined){
						pak.dependencies = [];
					}

					if(pak.devDependencies === undefined){
						pak.devDependencies = [];
					}
					
					if(Object.keys(pak.dependencies).indexOf(packageName) === -1 && Object.keys(pak.devDependencies).indexOf(packageName) === -1){
						return false;
					}

					console.log("\x1b[36m", `${dirName}\\${i}: ${packageName}`, "\x1b[0m");
					execSync(`yarn upgrade ${packageName} --latest` , {stdio:[0,1,2]});
				})
			};
		});
	});
});
