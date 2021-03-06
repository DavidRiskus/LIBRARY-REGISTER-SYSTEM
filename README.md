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
<img src="https://i.imgur.com/EtypRMQ.png" alt="Users Main Menu" width="600" height="250"/>

All User records are retrieved from the server once the page is loaded.

<b> *** Search User by Name or Barcode</b>: The search bar is a text input that will dynamically and instantlly,
without refreshing the webpage filter the user records table, based on the charachters contained inside user’s barcode or name.

<b> *** Add User</b>: click `ADD NEW USER' button`, new page is opened (Mobile view):

<img src="https://i.imgur.com/BVpd78O.png" alt="Add new User Menu" width="300" height="250"/>

Populate the prompted information in the form. Click `Submit` button, which will send a POST request to the server and update the database. Note: Barcode needs to contain 6 digits, otherwise the request will not be sent and prompt message will appear to provide 6 digits.

<b> *** Delete User</b>: Click the `DELETE` button in the Users Table, next to the chosen record under `Delete User` column. Confirmation pop-up message will appear, choose `CANCEL` or `OK`.

<b> *** Edit User</b>: Click the `EDIT` button in the Users Table, new page will open (Desktop View):

<img src="https://i.imgur.com/SixrXaR.png" alt="Update User Menu" width="600" height="250"/>
Respective user's id is used to retrieve data from the database and populate the current information in the form. Once the details are changed, click `Submit` button to finalise the update.

## Books
<img src="https://i.imgur.com/TRSo2sJ.png" alt="Books Main Menu" width="600" height="300"/>
All Book records are retrieved from the server once the page is loaded.

<b> *** Search Book by Title or Author</b>: The search bar is a text input that will dynamically and instantlly,
without refreshing the webpage filter the book records table, based on the charachters contained inside book’s title or author.

<b> *** Search Book by ID</b>:
input book's id in the prompted field, click `Search by ID`. If the id exists, book's Title and ISBN will be prompted.

<img src="https://i.imgur.com/MUPtiV9.png" alt="Search Book by ID" width="600" height="200"/>
Otherwise, message will be prompted that book's id does not exist.


<b> *** Add Book</b>: click `ADD NEW BOOK` button, new page is opened (Desktop view):

<img src="https://i.imgur.com/oMCjruH.png" alt="Add new User Menu" width="600" height="300"/>
Populate the form with prompted information. Clicking `Add Another Author` creates additional input field for more than 1 authors. 
Click `ADD NEW BOOK` to submit new book's details to the database.

<b> *** Delete Book</b>: Click the `DELETE` button in the Books Table, next to the chosen record under `Delete Book` column. Confirmation pop-up message will appear, choose `CANCEL` or `OK`.

<b> *** Edit Book</b>: Click the `EDIT` button in the Books Table, new page will open, change the information accordingly and click `Submit`.

## Loans

<b> *** Search Loans by User's ID</b>:
input user's id in the prompted field, click `SARCH` button.
<img src="https://i.imgur.com/hJxisE6.png" alt="Search Loans by User ID" width="700" height="200"/>

If there are any loans on provided user's ID, then the main table will be updated and `RESET SEARCH` button will appear, to return to previous state. Otherwise, "No loans found!" message will appear and `RESET SEARCH` button will appear.

<b> *** Overdue Column</b>: Counts the difference between Due Date and when the Loan was created.

<b> *** Add New Loan</b>: Click `ADD NEW LOAN` button, populate the form with prompted information. 

<img src="https://i.imgur.com/rN72zF3.png" alt="Add new Loan" width="300" height="300"/>


When finished, click `CREATE LOAN`.


<b> *** Delete Loan</b>: Click the `DELETE` button in the Loans Table, next to the chosen record under `Delete Loan` column. Confirmation pop-up message will appear, choose `CANCEL` or `OK`.
<b>Note:</b> If a user or book is deleted from the system, the loan is also deleted from the database.

<b> *** Edit Loan</b>: Click the `EDIT` button in the Loans Table, new page will open, change the information accordingly and click `Update Loan`.

<b> *** Find User Borrowing the Book</b>: Input book's ID in the prompted field. Click `SEARCH` If the book does not exist or has not been loaned out, "No loans found!" message will appear and `RESET SEARCH` button will appear. Otherwise, Loans table will update loans, showing the User ID holding the Book.
