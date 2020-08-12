const baseUrl = "http://127.0.0.1:3000";

//################# UPDATE BOOK ######################################

//METHOD RETRIEVED FROM: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
//AUTHOR: MDN web docs

//checking if the current location's URL contains the book_id parameter.
const urlParams = new URLSearchParams(window.location.search);
window.onload = function(){
  //if the parameter is present, GET request is sent to retrieve book's details.
  if(urlParams.has('book_id')) {
    let bookId = urlParams.get('book_id')
    // AJAX
    getBookDetails(bookId);
  } else{//HANDLE ERROR IF USER ID WAS NOT PROVIDED.
    handleInvalidState("No Book ID provided")
  }
}

//DEFINED FUNCTION TO HANDLE ERROR ACCORDINGLY:
const handleInvalidState = function(message) { //FUNCTION TAKES MESSAGE AS ARGUMENT, TO HANDLE ERRORS RELATED TO INCORRECT OR NO USER ID PROVIDED
  let outputDisplay = document.getElementById("update-book-output");
  outputDisplay.innerHTML = message;
  let form = document.getElementById("update-form")
  form.style.display = "none"; //FORM IS HIDDEN FROM THE USER TO AVOID HUMAN-ERROR.
}

//using Book Id as input, sending GET request, to retrieve book's details
const getBookDetails = function (bookId) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books/" + bookId + "?allEntities=true";
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}


//IF RESPONSE IS SUCCESSFULL, FORM INPUT FIELDS ARE POPULATED WITH THE RESPONSE CONTAINED VALUES:
const processSearchResponse = function(response) {
  if (response.target.status === 200){
    let book = JSON.parse(this.response);

    document.getElementById("update-book-title").value = book.title
    document.getElementById("update-book-isbn").value = book.isbn;


  }
  else if(response.target.status === 404){//Handle error if incorrect/non-existing user id provided.
    handleInvalidState("Invalid book ID")
  }
  else{
    handleInvalidState("ERROR INCURRED - Something went wrong")
  }

}



//retrieve input
let updateBookButton = document.querySelector("#update-book");
updateBookButton.addEventListener("click", function() {
  //select value from updating book's title input, select isbn input

  let bookTitle = document.querySelector("#update-book-title").value;

//checking if isbn is correct format:
  let userInput = document.querySelector("#update-book-isbn").value;
  let userInputLength = userInput.length
  if (userInputLength >= 6 && !isNaN(userInput)){
    bookISBN = document.querySelector("#update-book-isbn").value;
  }
//error message displayed if format is incorrect:
  else{
    let outputDisplay = document.querySelector("#update-book-output");
    let message = document.createTextNode("Wrong ISBN type added, must contain at least 6 digits");
    let container = document.createElement("li");
    container.appendChild(message);
    outputDisplay.appendChild(container)
    bookISBN = false //added for the purpose of console error handling.

  }
  //creating a new object, only if all inputs are valid,
  if (bookTitle && bookISBN) {
      newBookDetails = {
        "title":bookTitle,
        "isbn":bookISBN,
      };
      //  calling a PUT request function, passing in the new object
      updateBookRequest(newBookDetails);
  };
});

//pass input as a request, PUT request sent to books database, with new details entered
const updateBookRequest = function (newBookDetails) {
  // checking if book id is present inside the URL, passing it inside the queryUrl, to send newUserDetails to the correct Updating book.
  let bookId = urlParams.get('book_id')
  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books/" + bookId;
  xhttp.open('PUT', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newBookDetails));
}

//definined response process for update book request
const processResponse = function(response) {
//if status is 200, a message is displayed to the user, with their input, showing this has been updated to the database

  let outputDisplay = document.querySelector("#update-book-output");
  outputDisplay.innerHTML = "";
  if (response.target.status === 200){
    book = JSON.parse(this.response);

    //retrieving values respective values from the response:
    let updateBookTitle = book.title;
    let updateBookISBN = book.isbn;
    let updateBookid = book.id;
    //new user displayed information:
    let message = document.createTextNode(` Book Id: ${updateBookid} UPDATED TITLE: ${updateBookTitle}, ISBN: ${updateBookISBN}`); //ID: ${selectUserID},
    let container = document.createElement("li");
    container.appendChild(message);
    outputDisplay.appendChild(container)
  }
  //404 code added in books.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
    outputDisplay.innerHTML = "Invalid details provided";
  }
  else{
    outputDisplay.innerHTML = "ERROR INCURRED - Something went wrong";
  }
  //clear form's inputs
  let bookTitle = document.querySelector("#update-book-title").value = "";
  let bookISBN = document.querySelector("#update-book-isbn").value = "";

}
