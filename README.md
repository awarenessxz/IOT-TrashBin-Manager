# IOT-TrashBin-Manager
IOT Network project on trash bin management incorporating proximity sensors

# Environment
- Express (Node.js web application framework)
- Python 3

# Setup
1. [Install NodeJS](https://nodejs.org/en/).
2. Ensure that python is installed.
2. git clone this repo
3. cd `src`
4. Install the required node packages: `npm install`
5. run the server: `node bin/www`

# IMPORTANT NOTES:
1. Add python scripts into `lib/python` folder. 
2. Refer to `scripting.js` on how to interact with python script output
3. To add a new page, look at `app.js`, look for comment ADD NEW PAGE

# Reference
- Integrating Python with Nodejs
	- https://www.freecodecamp.org/news/how-to-integrate-a-python-ruby-php-shell-script-with-node-js-using-child-process-spawn-e26ca3268a11/
	- https://medium.com/geoblinktech/evolution-of-calling-python-from-node-4369a84f22c7
- Web Template
	- https://github.com/uxcandy/Label-Free-Bootstrap-Admin-Template/tree/master/src