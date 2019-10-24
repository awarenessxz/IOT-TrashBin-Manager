# IOT-TrashBin-Manager
IOT Network project on trash bin management incorporating proximity sensors

# Environment
- Express (Node.js web application framework)
- Python 3
- Postgresql 

# Local Setup
1. [Install NodeJS](https://nodejs.org/en/).
2. git clone this repo
3. Ensure that python is installed.
	- Install the required python libraries: `pip install -i requirements.txt` 
4. cd `src`
4. Start up the database
	- run `psql` terminal
	- create a file named `.env` in the current directory (src) and add the following in the file
		`DATABASE URL=postgres://username:password@host address:port/database name`
	- in the psql terminal, run `\i '[path_to_this_repo]/setup.sql'`
5. Start the server
	- cd `src`
	- Install the required node packages: `npm install`
	- run the server: `node bin/www`

# Heroku Setup
1. git clone this repo
2. `heroku login`
3. `heroku create`
4. `heroku buildpacks:set heroku/nodejs`
5. `heroku buildpacks:set heroku/python`
6. `git push heroku herokuHost:master`
		- `git commit --allow-empty -m "Adjust buildpacks on Heroku"` --> might have to do this to push to heroku after editing buildpacks
7. `heroku ps:scale web=1`
9. `heroku open`
0. `heroku logs --tail` --> view logs

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
- Heroku
	- https://stackoverflow.com/questions/25834500/push-different-branch-to-heroku/25834522
	- https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app