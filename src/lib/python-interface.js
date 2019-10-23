/* interface to call python script and get their output (BASH style) */

const { spawn } = require('child_process');

/* general script running method */
function runScript(cmd, ...args) {

	const scriptProcess = spawn(cmd, args);
	const stdout = [];
	const stderr = [];

	return new Promise(function(resolve, reject) {
		// Do async job
		scriptProcess.stdout.on('data', (data) => {
			stdout.push(data.toString());
		});
		scriptProcess.stderr.on('data', (data) => {
			stderr.push(data.toString());
		});
		scriptProcess.on('close', (code) => {
			if (code != 0) {
				// error! return error message
				const errorMessage = stderr.join('');
			 	reject(errorMessage);
			}

			// code executed with no error, return output
			const results = stdout.join('');
			resolve(results);
		});
	});
}

/* Call this method to run python script
 * @Param: filename = file.py
 *  	   args = argument for pthon script  */
async function runPythonScript(filename, ...args) {
	try {
		let filepath = 'lib/python/' + filename;
		let result = await runScript('python3', filepath, args);
		return result;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	runPythonScript
}
