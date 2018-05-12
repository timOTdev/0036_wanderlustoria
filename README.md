# Wanderlustoria by Timothy Hoang

<figure><img src="https://i.imgur.com/nwRZMmO.png" alt="Wanderlustoria Intro Page" style="width: 60%; display: block; margin-left: auto; margin-right: auto;"/></figure>

## To view this app online

- To view deployed app, visit: #

## To edit the source code

- Github Repo:
1. Have stable NPM and NodeJS versions installed on your computer
2. Navigate to the directory of choice and type `git clone #`
3. Set up a MongoDB community server: A) [Download](https://www.mongodb.com/download-center#community) B) [Mac OSX Setup Instructions from MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) or [MAC OSX Youtube Instructions](https://www.youtube.com/watch?v=DX15WbKidXY)
4. You will need API keys:
  - [Cloudinary Name, API Key and API Secret](https://cloudinary.com/documentation/solution_overview#account_and_api_setup) to host pictures for your users
  - [Geocoder API Key](https://www.npmjs.com/package/node-geocoder) to find the user-input location
  - [GMAIL account](https://accounts.google.com/) to send users emails to reset their passwords
5. Enter the variables in the `.env.variables` after the equal sign with no quotes and then RENAME the file to `.env` when you are done
6. Alternatively, you can also fork the repo and clone it (updates are possible, not currently planned)
7. Run the MongoDB server with the terminal command `mongod`
8. Run the node app with `node app.js` in the root directory
9. Open up your favorite editor and change the code if you want!

## About

- Wanderlustoria is an experience sharing platform for travelers to share photos and comments to inspire travel
- Sign up for an account, share photos and stories, comment on other stories, and make new friends
- Currently: Stable Version v1.0 -- updates are possible, not currently planned (as of 4/12/2018)

## Features

- Fast platform to share images and stories built on with NodeJS
- Upload photos which are hosted on cloudinary
- Sign up and log into your own account with PassportJS
- App finds the name of the location based on Google maps
- Add/update/delete stories with user login
- Add/update/delete comments with user login
- Create/update/delete your own user profile
- Check out other user's profiles
- Reset your forgotten passwords via email

## Admin Features

- Access the admin dashboard to view the newest data
- Create new cities and edit them, an admin only ability
- Update/delete users/cities/stories/comments

## App flow

### As a user

1. Register a new account
2. Set up your profile by clicking your name
3. Check out the available cities or request a new one from the admins via the contact form
4. Post a new story under a city
5. Post comments on other stories
6. Enjoy learning about new places
7. Charater limits are as follows: 1000 character limit for story body, 500 for user bio, 280 for user comments

### As an admin

1. Register an account as normal
2. Log into the Mongo database and grant admin permissions with `db.<your user database>.update({ username: "<username>" }, { $set: { isAdmin: true }})`
3. Now admins should have all special abilities and user abilities

## Technologies for this project

- [NodeJS](http://nodejs.org/) to host the back-end of the platform
- [ExpressJS](http://expressjs.com/) to provide an easy to use framework for NodeJS
- [EJS](https://github.com/mde/ejs) to write javascript in view files
- [MongoDB](https://www.mongodb.com/) to store information in a non-relational manner via schemas and models
- [Mongoose](http://mongoosejs.com/) to ease interaction with Mongo Database
- [PassportJS](http://www.passportjs.org/) to provide authentication and authorization
- [Cloudinary](http://cloudinary.com/) to host user-uploaded media
- [Imgur](http://imgur.com/) to host platform specific media
- [connect-flash](http://github.com/jaredhanson/connect-flash) to display notifications for users
- [express-sanitizer](http://github.com/markau/express-sanitizer) to sanitize code for malicious code
- [moment](http://github.com/moment/moment) to display times when stories and users were posted
- [nodemailer](http://github.com/nodemailer/nodemailer) to send forgot password emails
- [dotenv](http://github.com/motdotla/dotenv) to load local environment variables
- [body-parser](http://github.com/motdotla/dotenv) to parse information from user-input forms
- [eslint](http://github.com/eslint/eslint) to keep code tidy
- [locus](http://github.com/locustio/locust) to debugging routes in NodeJS
- [method-override](http://github.com/expressjs/method-override) to overwrite HTTP verbs like DELETE or PUT requests
- [node-geocoder](http://github.com/nchaulet/node-geocoder) to find destination location on google maps
- [multer](http://github.com/expressjs/multer) to handle multipart forms such as uploading images

## Possible Updates

1. In-app messaging system
2. Like/favorite system
3. Pagination system for stories and comments (currently only cities)
4. Comprehensive search system for all users/cities/stories/comments (currently only cities)
5. Flight price checker external api
6. Alternate authorization methods

## More pictures

### Home Page

<figure><img src="https://i.imgur.com/H8eNGQv.png" alt="Wanderlustoria Home Page" style="width: 60%; display: block; margin-left: auto; margin-right: auto;"/></figure>

### Cities Page

<figure><img src="https://i.imgur.com/tOKnI9s.png" alt="Cities Page" style="width: 60%; display: block; margin-left: auto; margin-right: auto;"/></figure>

### Admin Dashboard

<figure><img src="https://i.imgur.com/GTOlMjH.png" alt="Admin Dashboard Page" style="width: 60%; display: block; margin-left: auto; margin-right: auto;"/></figure>

### Story Page

<figure><img src="https://i.imgur.com/uF0GUaY.png" alt="Story Page" style="width: 60%; display: block; margin-left: auto; margin-right: auto;"/></figure>