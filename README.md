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
<img src="https://i.imgur.com/51JbHLx.png" alt="Home page view Desktop" width="300"/>

### Mobile view:
<img src="https://i.imgur.com/njiGS11.png" alt="Home page view Mobile" width="200" height="300"/>

## Users
<img src="https://i.imgur.com/EtypRMQ.png" alt="Users menu" width="600" height="250"/>

All User records are retrieved from the server once the page is loaded.

<b> *** Search User by Name or Barcode</b>: The search bar is a text input that will dynamically and instantlly,
without refreshing the webpage filter the user records table, based on the charachters contained inside user’s barcode or name.

<b> *** Add User</b>: click `ADD NEW USER' button`, new page is opened (Mobile view):

<img src="https://i.imgur.com/BVpd78O.png" alt="Add new User Menu" width="300" height="250"/>

Populate the prompted information in the form. Click `Submit` button, which will send a POST request to the server and update the database. Note: Barcode needs to contain 6 digits, otherwise the request will not be sent and prompt message will appear to provide 6 digits.

<b> *** Delete User</b>: Click the `DELETE` button in the Users Table, next to the chosen record under `Delete User` column. Confirmation pop-up message will appear, choose `CANCEL` or `OK`.

<b> *** Edit User</b>: Click the `Edit` button in the Users Table, new page will open (Desktop View):

<img src="https://i.imgur.com/SixrXaR.png" alt="Update User Menu" width="600" height="250"/>
Respective user's id is used to retrieve data from the database and populate the current information in the form. Once the details are changed, click `Submit` button to finalise the update.

