var express = require('express');
var py = require('../lib/python-interface');	// interface to run python scripts and get output
var op = require('../lib/output-processor');	// put codes to process python output here
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
	try {
		// execute python script and extract output
		let result = await py.runPythonScript('hello.py', '1', '2');
		res.render('pyScriptingTemplate', { 
			title: 'Scripting',
			data: result 
		});
	} catch (err) {
		// pass error message to express middleware
		next(new Error(err));
	}
});

module.exports = router;
