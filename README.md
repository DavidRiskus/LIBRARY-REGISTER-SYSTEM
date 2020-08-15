# LIBRARY-REGISTER-SYSTEM

# Installation

inside the `LIBRARY-REGISTER-SYSTEM/back-end` run:

```
npm install
```
`node_modules` folder with node.js dependencies will be retrieved.

## Running the Server

Start the server with:

```
node server.js
```

This will start the server running on `127.0.0.1` port `3000`.

## Check everything is working correctly

To check the database and server are operating correctly you can open `http://127.0.0.1:3000/authors` in a Web Browser. This should return a JSON representation of all the Authors stored in the database.


## Making requests

Requests to the server can be made to the endpoints specified in `server.js`. For details on the Models and the Fields they contain, check `data.js`

## Running the Front-End Application

Run the application in the development mode in `LIBRARY-REGISTER-SYSTEM/front-end` i.e.:

`python -m SimpleHTTPServer`

check if the app is running on `http://0.0.0.0:8000/`

# Features

User is presented with the homepage menu:

### Desktop view:
<img src="https://i.imgur.com/51JbHLx.png" alt="Image of side menu" width="300"/>

### Mobile view:
<img src="https://i.imgur.com/njiGS11.png" alt="Image of side menu" width="200" height="300"/>

## Users
<img src="https://i.imgur.com/EtypRMQ.png" alt="Image of side menu" width="600" height="250"/>

All User records are retrieved from the server once the page is loaded.

<b>Search User by Name or Barcode</b>: The search bar is a text input that will dynamically and instantlly,
without refreshing the webpage filter the user records table, based on the charechters contained inside user’s barcode or name.



