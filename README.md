# LIBRARY-REGISTER-SYSTEM

# Installation

Download and install all requirements for the server with:

```
npm install
```
xxxxxxxxxx This will create a `library.sqlite` file inside the LIBRARY-REGISTER-SYSTEM/back-end/`data/` directory and pre-populate it with some sample data.

**CAUTION!** Running this command will remove any data already stored in the database `data/library.sqlite`. It should be used with caution, only when you want to reset the Database to its initial state.

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


# Features
