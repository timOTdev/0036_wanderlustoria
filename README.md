# Wanderlustoria

<figure><img src="https://i.imgur.com/nwRZMmO.png" alt="Wanderlustoria Intro Page" style="width: 60%; display: block; margin: 0 auto;"/></figure>

## To view this app online

- To view deployed app, visit: [Wanderlustoria Home](https://wanderlustoria.herokuapp.com/)
- Info at the end to edit the source code

## About

- [Wanderlustoria](https://wanderlustoria.herokuapp.com/) is an picture sharing platform for travel-enthusiasts to share their experience and inspire others to travel
- Sign up for an account, share photos and stories, comment on other stories, and make new friends
- Currently: Stable Version v1.0 -- updates are possible, not currently planned (as of 4/15/2018)

## Features

- A fast, powerful platform built with NodeJS/ExpressJS/MongoDB
- Upload photos which are hosted on Cloudinary
- Sign up and log into your own account with PassportJS
- Auto-finds Google Map of location with use of Geocoder API
- Add/update/delete stories with user login
- Add/update/delete comments with user login
- Create/update/delete your own user profile
- Check out other user's profiles
- Reset your forgotten passwords via email with Nodemail API

## Admin Features

- Access the admin dashboard to view the newest data
- Create new cities and edit them, an admin only ability
- Update/delete users/cities/stories/comments

## App flow

### As a user

1. Register a new account
2. Set up your profile by clicking your name on the top right
3. Don't forget to fill out your profile by click on the your name at the top right
4. Check out the available cities or request a new one from the admins via the contact form on home page
5. Post a new story under a city
6. Post comments on other stories
7. Enjoy learning about new places and making friends
8. Character limits are as follows: 1000 character limit for story body, 500 for user bio, 280 for user comments

### As an admin

1. Register an account as normal
2. Log into the Mongo database and grant admin permissions with `db.<your user database>.update({ username: "<username>" }, { $set: { isAdmin: true }})` if using command line or log into [mLAB](https://mlab.com/) and edit directly
3. Now admins should have all special abilities and user abilities
4. Feel free to add new cities and administrate

## Technologies for this project

- [NodeJS](http://nodejs.org/) to host the back-end of the platform
- [ExpressJS](http://expressjs.com/) to provide an easy-to-use framework to interface NodeJS
- [EJS](https://github.com/mde/ejs) to write javascript in view files
- [MongoDB](https://www.mongodb.com/) to store information in a non-relational manner via schemas and models
- [Mongoose](http://mongoosejs.com/) to interface with Mongo Database
- [PassportJS](http://www.passportjs.org/) to provide authentication and authorization
- [Cloudinary](http://cloudinary.com/) to host user-uploaded media
- [Imgur](http://imgur.com/) to host platform specific media
- [Heroku](https://www.heroku.com/) to provide back-end hosting
- [mLAB](https://mlab.com/) to provide back-end database hosting
- [connect-flash](http://github.com/jaredhanson/connect-flash) to display notifications for users
- [express-sanitizer](http://github.com/markau/express-sanitizer) to sanitize code for malicious code
- [moment](http://github.com/moment/moment) to display times when stories and comments were posted
- [nodemailer](http://github.com/nodemailer/nodemailer) to send forgot password emails
- [dotenv](http://github.com/motdotla/dotenv) to load local environment variables
- [body-parser](http://github.com/motdotla/dotenv) to parse information from user-input forms
- [eslint](http://github.com/eslint/eslint) to keep code tidy
- [nodemon](https://github.com/remy/nodemon) to monitor changes in app and restart the server automatically
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
6. Alternate authorization methods like Twitter, Facebook, Google

## To edit the source code

- Github Repo: [Wanderlustoria Repo](https://github.com/timh1203/wanderlustoria)
1. Have stable NPM and NodeJS versions installed on your computer
2. Navigate to the directory of choice and type `git clone https://github.com/timh1203/wanderlustoria`
3. Set up a **MongoDB community server** for a local database (recommended) or **mLAB** database for a free online database:
4. For a Mongo Community server:
- [Download MongoDB Comunnity Server](https://www.mongodb.com/download-center#community)
- [Follow Mac OSX Setup Instructions from MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) or use the youtube video
- [Follow MAC OSX Setup Instructions from Youtube](https://www.youtube.com/watch?v=DX15WbKidXY)
5. For an MLAB database:
- Sign up at [mLab Home](https://mlab.com/)
- Remember your username, password, and database name for the `.env.variables` file later
6. You will also need API keys:
- [Cloudinary Name, API Key and API Secret](https://cloudinary.com/console/dashboard) to host pictures for your users
- [Gmail account](https://accounts.google.com/signin/v2/identifier?service=mail) to send users emails to reset their passwords
- 2 [Geocoder API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key) to find the user-input location
- You will need one Geocoder API key for the back-end to make requests without restrictions (GEOCODER_SERVER_API_KEY in .env), then another for the front end for the users to make requests (GEOCODER_CLIENT_API_KEY)
7. Enter these api key variables in the `.env.variables` file and RENAME the file to `.env` when you are done
- API variables inside .env are after the equal sign without quotes such as `CLOUDINARY_API_SECRET=abc123`
- MLABDATABASE follows a format such as `mongodb://<dbuser>:<dbpassword>@ds119370.mlab.com:19370/<database name>`
- LOCALDATABASE is for if you plan to run a local Mongo database, don't forget to change `mongoose.connect()` line in app.js
- Fill in the information from the MLAB signup from step 5
- If you plan on using the password reset feature, nodemailer also requires [GMAIL Lesser Secure Apps Feature](https://myaccount.google.com/lesssecureapps)
8. Run the MongoDB server with the terminal command `mongod` or have it linked up to MLAB database
9. Run the node app with `node app.js`, or nodemon if installed, in the root directory
10. Open up your favorite editor and hack away!

## More pictures

### Home Page

<figure><img src="https://i.imgur.com/H8eNGQv.png" alt="Wanderlustoria Home Page" style="width: 60%; display: block; margin: 0 auto;"/></figure>

### Cities Page

<figure><img src="https://i.imgur.com/tOKnI9s.png" alt="Cities Page" style="width: 60%; display: block; margin: 0 auto;"/></figure>

### Admin Dashboard

<figure><img src="https://i.imgur.com/GTOlMjH.png" alt="Admin Dashboard Page" style="width: 60%; display: block; margin: 0 auto;"/></figure>

### Story Page

<figure><img src="https://i.imgur.com/uF0GUaY.png" alt="Story Page" style="width: 60%; display: block; margin: 0 auto;"/></figure>