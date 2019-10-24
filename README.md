# IOT-TrashBin-Manager
IOT Network project on trash bin management incorporating proximity sensors

# Environment
- Express (Node.js web application framework)
- Python 3
- Postgresql 

# Setup
1. [Install NodeJS](https://nodejs.org/en/).
2. git clone this repo
3. Ensure that python is installed.
	- `pip install -i requirements.txt`
4. Start up the database
	- run `psql` terminal
	- edit `src/.env` file based on your psql credentials
	- in the psql terminal, run `\i '[path_to_this_repo]/setup.sql'`
5. Start the server
	- cd `src`
	- Install the required node packages: `npm install`
	- run the server: `node bin/www`

# IMPORTANT NOTES:
1. Add python scripts into `lib/python` folder. 
2. Templates
	- Refer to `pyScriptingTemplate.js` and `pyScriptingTemplate.ejs` on how to interact with python script output
	- Refer to `psqlTemplate.js` and `psqlTemplate.ejs` on how to interact 
3. To add a new page, look at `app.js`, look for comment ADD NEW PAGE

# Reference
- Integrating Python with Nodejs
	- https://www.freecodecamp.org/news/how-to-integrate-a-python-ruby-php-shell-script-with-node-js-using-child-process-spawn-e26ca3268a11/
	- https://medium.com/geoblinktech/evolution-of-calling-python-from-node-4369a84f22c7
- Web Template
	- https://github.com/uxcandy/Label-Free-Bootstrap-Admin-Template/tree/master/src