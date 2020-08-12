const baseUrl = "http://127.0.0.1:3000";



// ###################### SEARCH BOOK BY ID #############################


const processBookById = function(response) {
  console.log(response);
  let bookById = document.querySelector("#book-id-search");
  let bookInput = document.querySelector("#search-book-by-id");
  let searchTerm = bookInput.value;
  if (response.target.status === 200){
    let book = JSON.parse(this.response);

// DISPLAY MESSAGE BOOK ID, TITLE, ISBN
    bookById.innerHTML ="";
    let newItem = document.createElement("li");
    newItem.appendChild(document.createTextNode(`BOOK ID: ${book.id} TITLE ${book.title} ISBN: ${book.isbn}`));

    bookById.appendChild(newItem);
  }else if(response.target.status === 404){
    bookById.innerHTML = "Book ID " + searchTerm + " does not exist.";
  }else{
    bookById.innerHTML = " something went wrong";
  }
  bookInput.value = ""
}



//retrieve input
let bookIdButton = document.getElementById("search-book-id-button");
bookIdButton.addEventListener("click", function() {
    let searchTerm = document.getElementById("search-book-by-id").value;


    if (searchTerm) {
        searchBookById(searchTerm);
    }
});


//pass input as a request
const searchBookById = function (searchTerm) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books/" + searchTerm;
  xhttp.addEventListener('load', processBookById);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}


//################# ALL BOOKS ######################################


// DYNAMICALLY POPULATES HEADING'S ROW WITH CELL HEADINGS INSIDE MAIN TABLE
const addTableHeadings = function(parentRow, textContent) {
    let newItem = document.createElement("th");
    newItem.appendChild(document.createTextNode(textContent));
    parentRow.appendChild(newItem);
};

// MAIN FUNCTION THAT POPULATES TABLE ITEMS AFTER GET REQUEST
const populateTableItems = function(){

    //RETRIEVE HEADING AND BODY SEPARATLEY

  // TABLES' HEADING OUTPUT
  let outputDivHeadings = document.createElement('tr');
  let headingContainer = document.getElementById("books-table-head");
  document.getElementById("books-table-head").innerHTML = "";
  headingContainer.appendChild(outputDivHeadings);

  // TABLE'S BODY OUTPUT

  let outputDiv = document.getElementById("books-output");
  document.getElementById("books-output").innerHTML = "";

  //headings

  addTableHeadings(outputDivHeadings, "ID");
  addTableHeadings(outputDivHeadings, "Title");
  addTableHeadings(outputDivHeadings, "ISBN");
  addTableHeadings(outputDivHeadings, "Created At");
  addTableHeadings(outputDivHeadings, "Updated At");
  addTableHeadings(outputDivHeadings, "Author");
  addTableHeadings(outputDivHeadings, "Update Book");
  addTableHeadings(outputDivHeadings, "Delete Book");

  //take the global variable, containing books array, loop through, to populate their details into the table

  window.books.forEach(function(book){
      let searchBar = document.getElementById("search-books-title-or-author");
      let searchTerm = searchBar.value;

      //################# B2 - SEARCH BOOK's DETAILS BY TITLE OR AUTHOR ######################################
      //loop through all author names, store them in a single string
      let authorNameString = ''
      for(let i = 0; i < book.Authors.length; i++){
        let author = book.Authors[i]
        authorNameString += author.name +","+ "\n"
      }

      //if the search term does not match any charachter's continue populating the whole table
      if(!book.title.toLowerCase().includes(searchTerm.toLowerCase()) && !authorNameString.toLowerCase().includes(searchTerm.toLowerCase())){
         return;
      }

      //create a row per user
      var tr = document.createElement('tr');


      //create nodes, with book's individual deatails
      let nodes = [
          document.createTextNode(book.id),  document.createTextNode(book.title),
          document.createTextNode(book.isbn),
          document.createTextNode(new Date(book.createdAt).toLocaleString()),
          document.createTextNode(new Date(book.updatedAt).toLocaleString()),
          document.createTextNode(authorNameString)
      ]

      //append each individual detail into a node, and append node into created cell
      for(let i = 0; i < nodes.length; i++){
          let node = nodes[i]
          let td = document.createElement('td')
          td.appendChild(node)
          tr.appendChild(td)
      }

    //create a user edit/update button
      var btn = document.createElement('input');
      //RETRIEVED FROM https://stackoverflow.com/questions/15315315/how-do-i-add-a-button-to-a-td-using-js
      //AUTHOR: Niet the Dark Absol

      //location origin is taken, creating a new url that can contain individual book's id.
      btn.addEventListener('click', function() {
          let origin = location.origin
          location.href= origin + '/update_book.html?book_id=' + book.id
      });

      //iteration continues, edit button is added to the same book's row, each book's row has this button
      btn.type = "button";
      btn.className = "button table-button black";
      btn.value = "edit";
      var tdEdit = document.createElement('td');
      tdEdit.appendChild(btn);
      tr.appendChild(tdEdit)



      //DELETE FUNCTION

      //delete button created
      var btn2 = document.createElement('input'); //EXTRA FEATURE (SAFETY)

      //delete button clicked, Confirmation alert pops up, if ok, clicked book.id is passed into deleteUser function
      //also global book id variable is made, to be used later for deleting any loans if that book had.
      btn2.addEventListener('click', function() {
        let confirmed = confirm("Do you really want to delete " + book.title + "?")
        if(confirmed){
          window.bookId = book.id;
          console.log(window.bookId);
          deleteBook(window.bookId)

        }
      });

      //iteration continues, delete button is added to the same user's row, each user user's row has this button
      btn2.type = "button";
      btn2.className = "button table-button sky";
      btn2.value = "delete";
      var tdDelete = document.createElement('td');
      tdDelete.appendChild(btn2);
      tr.appendChild(tdDelete)

      //row with populated details is added to the table
      outputDiv.appendChild(tr)

      });

}
  //RELOAD PAGE AFTER BOOK WAS DELETED
const processDeleteBook = function(response){
  window.location.reload() //reload the page to reflect deletion of an item
}

  //DELETE REQUEST - DELETE USER
const deleteBook = function (bookId) {
  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books/" + bookId;
  xhttp.addEventListener('load', processDeleteBook);
  xhttp.open('DELETE', queryUrl);
  xhttp.send();
  //CALL GET REQUEST FUNCTION TO RETRIEVE ALL LOANS
  loanSearchRequest();
}

//REQUEST IS SENT TO RETRIEVE ALL LOANS

const loanSearchRequest = function () {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans";
  xhttp.addEventListener('load', processLoanResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}

//PROCESSING RETRIEVED ALL LOANS
const processLoanResponse = function(response) {

  if (response.target.status == 200){
    let loans = JSON.parse(this.response);

    //IF ANY OF THE LOANS' BookId matches the deleted book.id, then the respective loan will be deleted, deleteLoan function is called
    //loan's id is passed in, a false value passed, to not do any response handling.
    loans.forEach(function(loan){
      if (loan.BookId == window.bookId) {
        deleteLoan(loan.id, false);

      }
    });
  }
  //IF response is not 200 status, error message is displayed
  else{
      let outputDiv = document.getElementById("loans-output");
      let newItem = document.createElement("tr");
      newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
      outputDiv.appendChild(newItem);
    }
};



//reload the page to reflect deletion of an item
const processDeleteLoan = function(response){
window.location.reload();
}

//DELETE LOAN RELATING TO DELETED USER
const deleteLoan = function (loanId, needHandling=true) { //need search term to pass?

var xhttp = new XMLHttpRequest();
var queryUrl = baseUrl + "/loans/" + loanId;
if(needHandling){
  xhttp.addEventListener('load', processDeleteLoan);
}
xhttp.open('DELETE', queryUrl);
xhttp.send();
}






// HANDLE BOOK GET REQUEST
const processSearchResponse = function(response) {

  // IF RESPONSE IS SUCCESSFUL AND RETURNS STATUS 200, ESTABLISH A GLOBAL VARIABLE BOOKS, AND CALL
  //FUNCTION TO LOOP THROUGH ALL BOOKS, DYNAMICALLY CREATING A TABLE

  if (response.target.status == 200){
    window.books = JSON.parse(this.response);
    populateTableItems()
  }
  // IF RESPONSE IS NOT STATUS 200, DISPLAY AN ERROR MASSAGE TO BOOKS, DYNAMICALLY CREATING A ROW INSIDE A TABLE
  else{
    let outputDiv = document.getElementById("books-output");
    let newItem = document.createElement('tr');
    newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
    outputDiv.appendChild(newItem);
  }
};

//PAGE LOADS UP ONCE ACCESSED

window.addEventListener("load", function(){
  console.log("page loaded");

  // CALL FUNCTION WITH GET REQUEST
  bookSearchRequest();
})

//GET REQUEST SENT TO ALL BOOKS WITH AUTHORS PROPERTY ENDPOINT
const bookSearchRequest = function () {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/books?allEntities=true";
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}



//Check Search bar
let searchBar = document.getElementById("search-books-title-or-author");
searchBar.addEventListener("input", function() {
    populateTableItems();
});


//######################################### TOP BUTTON ############################################################

// CODE FULLY TAKEN FROM W3SCHOOLS, NO ADJUSTMENTS MADE

//https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
