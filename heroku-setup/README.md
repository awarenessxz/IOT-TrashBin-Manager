# Overview

This branch is dedicated to running this project live. Follow the steps below to set up the heroku app.

The current deployment can be accessed from [https://sheltered-reaches-90818.herokuapp.com/](https://sheltered-reaches-90818.herokuapp.com/).

# Local Setup
1. git clone this repo
2. Install Heroku CLI
	- `brew install heroku/brew/heroku` --> MacOS
3. `heroku login`
4. **If you want to deploy a new heroku app, run option 1. Else if you want to connect to the existing heroku app, run option 2**
	- Option 1: `heroku create`
	- Option 2: `heroku git:remote -a sheltered-reaches-90818` where `sheltered-reaches-90818` is the name of the heroku app which you can find in your heroku dashboard.
5. Postgresql Database setup
	- verify if Heroku Postgre add-on exists. `heroku addons`
	- If it does not exists, add using `heroku addons:create heroku-postgresql:hobby-dev`
6. `heroku buildpacks:clear` --> if necessary
7. `heroku buildpacks:set https://github.com/awarenessxz/IOT-TrashBin-Manager-Buildpack` --> setting up database	
8. `heroku buildpacks:add https://github.com/awarenessxz/subdir-heroku-buildpack` --> requires this as our src is not in the root folder
9. `heroku buildpacks:add heroku/nodejs`
10. `heroku buildpacks:add heroku/python`
11. `heroku config:set PROJECT_PATH=src`
12. `heroku config:set SQL_SETUP_SCRIPT=setup.sql`
13. `git push heroku herokuHost:master` --> heroku uses master branch by default
		- `git commit --allow-empty -m "Adjust buildpacks on Heroku"` --> might have to do this to push to heroku after editing buildpacks
14. `heroku ps:scale web=1`
15. `heroku open`
16. `heroku logs --tail` --> view logs

## To run python scripts
1. Ensure that you are login `heroku login`
2. `heroku run python lib/python/hello.py` --> run the python script
3. If you prefer to have a bash interaction. Use `heroku run bash` 

# References
- Heroku 
	- https://stackoverflow.com/questions/25834500/push-different-branch-to-heroku/25834522
- Buildpacks
	- https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app
	- https://github.com/timanovsky/subdir-heroku-buildpack
- MQTT
	- https://github.com/CloudMQTT/cloudmqtt-website/blob/master/views/docs-nodejs.md
	- https://github.com/mcollina/mosca
- Socket.io
	- https://robdodson.me/deploying-your-first-node-dot-js-and-socket-dot-io-app-to-heroku/
	- https://devcenter.heroku.com/articles/node-websockets



