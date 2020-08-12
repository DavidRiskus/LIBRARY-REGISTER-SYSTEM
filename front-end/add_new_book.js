const baseUrl = "http://127.0.0.1:3000";

//################# U1 (part1)- ADD NEW BOOK ######################################
//ADD NEW AUTHOR
//RETRIEVED FROM https://stackoverflow.com/questions/29636205/why-do-entered-input-values-disappear-when-additional-inputs-are-added-with-java
//AUTHOR: Tiago

//Function that adds additional input fields, to add additional authors if needed,
function add_fields() {
  var container = document.getElementById("content");

  var htmlObject = document.createElement('div');

  htmlObject.innerHTML = "<span>Author: <input type='text' class='authors' name='author[]' value='' /></span>";
  container.appendChild(htmlObject);

}

//Global variable used, to maintain cleaner code to avoid excessive data extraction.
//Function to select a single author
const collectNewAuthor = function(){
  author = window.allAuthors[0]
  window.allAuthors.splice(0, 1) //splice used to remove an item from array.
  newAuthorDetails = {
      "name":author
  };

  return newAuthorDetails
}


//definined response process for add new user request
const processAddResponse = function(response) {
//if status is 200, all authors under css .authors class are selected, from multiple fields, or single field.
  let outputDisplay = document.querySelector("#added-book");
  if (response.target.status === 200){
    book = JSON.parse(this.response);
    outputDisplay.innerHTML = "";
    let bookId = book.id;
    let authors = document.querySelectorAll(".authors");

 // Collect all authors from the input form.
    window.allAuthors = []
    for (let i = 0; i < authors.length; i++){
      let author = authors[i].value;
      window.allAuthors.push(author)
    }

    newAuthorDetails = collectNewAuthor(); // retrieves new author's name

    //passing in new author's name into book submition
    submitBookWithAuthor(newAuthorDetails);

  }
  //404 code added in books.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
    outputDisplay.innerHTML = "Invalid details provided";
  }
  else{
    outputDisplay.innerHTML = "ERROR INCURRED - Something went wrong";
  }
    //clear form's inputs
  let addBookTitle = document.querySelector("#add-book-title").value = "";
  let addBookISBN = document.querySelector("#add-book-isbn").value = "";
}

// A POST REQUEST IS SENT, to books, with newly added book's id, and to the authors endpoint
const submitBookWithAuthor = function(newAuthorDetails){
  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books/" + book.id + "/authors";
  xhttp.open('POST', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processAuthorResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newAuthorDetails));
}

// Processing response, The response handler for this POST request keeps sending the same POST
// request as many times as there are input values, in the authors array.
const processAuthorResponse = function(response){
  let outputDisplay = document.querySelector("#added-book");
  if (response.target.status === 200){
    if(window.allAuthors.length > 0){
      newAuthorDetails = collectNewAuthor()
      submitBookWithAuthor(newAuthorDetails)

    }else{// After all authors have been submitted.
      //display message to user Book has been created.
      let message = document.createTextNode(`Book ID: ${book.id} was created, Authors have been added.`);
      let container = document.createElement("li");
      container.appendChild(message);
      outputDisplay.appendChild(container);

      let authors = document.querySelectorAll(".authors");

   // Collect all authors from the input form and clear the input form's fields
      for (let i = 0; i < authors.length; i++){
        authors[i].value = "";
      }


    }
  }
  //404 code added in books.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
     outputDisplay.innerHTML = "Invalid details provided";
   }
   else{
     outputDisplay.innerHTML = "ERROR INCURRED - Something went wrong";
   }
}


//retrieve input
let addBookButton = document.querySelector("#add-book");
addBookButton.addEventListener("click", function() {

  //select value from new book title input, select isbn input
  let addBookTitle = document.querySelector("#add-book-title").value;

  //checking if isbn is correct format:
  let userInput = document.querySelector("#add-book-isbn").value;
  let userInputLength = userInput.length
  if (userInputLength >= 6 && !isNaN(userInput)){
    addBookISBN = document.querySelector("#add-book-isbn").value;
  }
  //error message displayed if format is incorrect
  else{
    let outputDisplay = document.querySelector("#added-book");
    let message = document.createTextNode("Wrong ISBN type added, must contain at least 6 digits");
    let container = document.createElement("li");
    container.appendChild(message);
    outputDisplay.appendChild(container);
    addBookISBN = false
  }
//creating a new object, only if all inputs are valid,
  if (addBookTitle && addBookISBN) {
      newBookDetails = {
        "title":addBookTitle,
        "isbn":addBookISBN,
      };
      //  calling a POST request function, passing in the new object
      addBookRequest(newBookDetails);
  };
});

//pass input as a request, POST request sent to books database, with new details entered
const addBookRequest = function (newBookDetails) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books";
  xhttp.open('POST', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processAddResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newBookDetails));
}
