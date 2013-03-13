## What is this?

This is a demo for a question in the mojito forum:

http://developer.yahoo.com/forum/Yahoo-Mojito/What-is-the-equivalent-of-express-connect/1347756036577-a6be3fb1-2223-4a8c-a176-ed2ac94b983f/1363029036870

## How to test it?

 * `npm install`
 * `./node_modules/mojito/bin/mojito start`
 * browse to `http://localhost:8666/`
 
 
## Changes to base demo:
 
 I added session support for login
 

## Basic Setup
 
 (I am using Mac OSX) 
 
 Install homebrew fore easy installations: 
 http://mxcl.github.com/homebrew/
 
 Install Node JS Using Homebrew:
 
 http://madebyhoundstooth.com/blog/install-node-with-homebrew-on-os-x/
 (Please note to have at lease the CLI Developer tools since you need to compile)
 
 
 Install Mojito  (I installed with the -g flag)
 http://developer.yahoo.com/cocktails/mojito/docs/quickstart/
 
 Please note as of writing this the page says Nodejs .8+ is not supported.
 It is.
 
 
## Path Issues 
Look out for the node_path "exporting" properly:

On the mac this means to create a ".profile" page on the user root (~)
To turn on hidden files:
http://guides.macrumors.com/Viewing_hidden_files_on_a_Mac


I have the following in the file: 
export NODE_PATH="./node_modules:/usr/local/share/npm/lib/node_modules/:/usr/local/opt/node/lib/node_modules:/usr/local/share/npm/lib/node_modules/mojito/node_modules"
export PATH="/usr/local/share/npm/bin:$PATH"

Explanation of why I have things in path:
"./node_modules" <- pick up local installed packages such as passport and passport-local
"node_modules:/usr/local/share/npm/lib/node_modules/mojito/node_modules"  <-acess to express lib
 
 
  
 
 ## How I start the app:
 CD to project root directory (containing the server.js file) and type:
 mojito start (or node server.js)
 
 The valid username and passwords are in ./middleware/passport.js
 in the "users" variable
  
 
 
 

 
 

 
 
 
