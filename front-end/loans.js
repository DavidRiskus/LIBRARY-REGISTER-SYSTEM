const baseUrl = "http://127.0.0.1:3000";


//################# ALL LOANS ######################################

// DYNAMICALLY POPULATES HEADING'S ROW WITH CELL HEADINGS INSIDE MAIN TABLE
const addTableHeadings = function(parentList, textContent) {
    let newItem = document.createElement("th");
    newItem.appendChild(document.createTextNode(textContent));
    parentList.appendChild(newItem);
};

// MAIN FUNCTION THAT POPULATES TABLE ITEMS AFTER GET REQUEST
const populateTableItems = function(loans){

    //RETRIEVE HEADING AND BODY SEPARATLEY

    // TABLES' HEADING OUTPUT
    let outputDivHeadings = document.createElement('tr');
    let headingContainer = document.getElementById("loans-table-head");
    document.getElementById("loans-table-head").innerHTML = "";
    headingContainer.appendChild(outputDivHeadings);

    // TABLE'S BODY OUTPUT

    let outputDiv = document.getElementById("loans-output");
    document.getElementById("loans-output").innerHTML = "";

    //headings

    addTableHeadings(outputDivHeadings, "ID");
    addTableHeadings(outputDivHeadings, "Due Date");
    addTableHeadings(outputDivHeadings, "Created At");
    addTableHeadings(outputDivHeadings, "Overdue Status");
    addTableHeadings(outputDivHeadings, "User ID");
    addTableHeadings(outputDivHeadings, "Book ID");
    addTableHeadings(outputDivHeadings, "Update Loan");
    addTableHeadings(outputDivHeadings, "Delete Loan");
    loans.forEach(function(loan){
      if(loan.BookId && loan.UserId){// if Book ID and User ID exists, then all corresponding loan's details are displayed.

        let overdueStatus
        //establish an object, containing todays date
        let today = new Date()
        //Determine whether the book is overdue, alternatively display remaining days.
        let diffDays = parseInt((today - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24), 10);

        //RETRIEVED FROM: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
        //AUTHOR: volkan er

        if(diffDays > 0){
          overdueStatus = 'Overdue By ' + diffDays + ' days'
        } else{
          let daysLeft = diffDays * (-1)
          overdueStatus = 'Not overdue. (' + daysLeft + ' days left)'
        }

        //create a row per user
        var tr = document.createElement('tr');

        //create nodes, with loan's individual deatails
        let nodes = [
            document.createTextNode(loan.id),
            document.createTextNode(new Date(loan.dueDate).toLocaleString()),
            document.createTextNode(new Date(loan.createdAt).toLocaleString()),
            document.createTextNode(overdueStatus),
            document.createTextNode(loan.UserId),
            document.createTextNode(loan.BookId)
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

        //location origin is taken, creating a new url that can contain individual loan's id.
        btn.addEventListener('click', function() {
            let origin = location.origin
            location.href= origin + '/update_loan.html?loan_id=' + loan.id
        });

        //iteration continues, edit button is added to the same loan's row, each loan's row has this button
        btn.type = "button";
        btn.className = "button table-button black";
        btn.value = "edit";
        var tdEdit = document.createElement('td');
        tdEdit.appendChild(btn);
        tr.appendChild(tdEdit)


        //DELETE FUNCTION
        var btn2 = document.createElement('input');

        //delete button clicked, Confirmation alert pops up, if ok, clicked loan.id is passed into deleteUser function
        btn2.addEventListener('click', function() {
          let confirmed = confirm("Do you really want to delete loan " + loan.id + " for" + " User " + loan.UserId + "?")
          if(confirmed){
            deleteLoan(loan.id);
          }
        });

        btn2.type = "button";
        btn2.className = "button table-button sky";
        btn2.value = "delete";
        var tdDelete = document.createElement('td');
        tdDelete.appendChild(btn2);
        tr.appendChild(tdDelete)

        //row with populated details is added to the table
        outputDiv.appendChild(tr)

      }else{
        deleteLoan(loan.id, false);
      }
      });
}

//reload the page to reflect deletion of an item
const processDeleteLoan = function(response){
  window.location.reload()
}

const deleteLoan = function (loanId, needHandling=true) {

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

  // IF RESPONSE IS SUCCESSFUL AND RETURNS STATUS 200, ESTABLISH CALL A
  //FUNCTION TO PASS AN ARGUMENT AND LOOP THROUGH ALL LOANS, DYNAMICALLY CREATING A TABLE

  if (response.target.status == 200){
    let loans = JSON.parse(this.response);
    populateTableItems(loans)
  }
    // IF RESPONSE IS NOT STATUS 200, DISPLAY AN ERROR MASSAGE TO LOANS, DYNAMICALLY CREATING A ROW INSIDE A TABLE
  else{
      let outputDiv = document.getElementById("loans-output");
      let newItem = document.createElement("tr");
      newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
      outputDiv.appendChild(newItem);
    }
};

//PAGE LOADS UP ONCE ACCESSED

window.addEventListener("load", function(){
  console.log("page loaded");

  // CALL FUNCTION WITH GET REQUEST
  loanSearchRequest();
})
//GET REQUEST SENT TO ALL BOOKS WITH AUTHORS PROPERTY ENDPOINT
const loanSearchRequest = function () {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans";
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}

//################# L2 - SEARCH USER'S LOANS #####################################

// IF RESPONSE IS SUCCESSFUL, pass loans into populate table to display all users loans

const processLoanResponse = function(response) {
  if (response.target.status === 200){
    let loans = JSON.parse(this.response);
    let searchTerm = document.querySelector("#user-loans-by-id").value;
    searchTerm_int = parseInt(searchTerm)

    populateTableItems(loans)

    createResetButton()

    if(loans.length == 0){ //if no loans found, display message:
      let outputDiv = document.getElementById("loans-output");
      let newItem = document.createElement("tr");
      newItem.appendChild(document.createTextNode("No loans found!"));
      outputDiv.appendChild(newItem);
    }
    //clean the input form
    searchTerm = document.querySelector("#user-loans-by-id").value = "";
  }
  //incase response status is not 200:
  else{
    let outputDiv = document.getElementById("loans-output");
    let newItem = document.createElement("tr");
    newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
    outputDiv.appendChild(newItem);
  }
};


//retrieve input
let loanButton = document.getElementById("button-search-users-loans");
loanButton.addEventListener("click", function() {
    let searchTerm = document.getElementById("user-loans-by-id").value;


    if (searchTerm) {
        usersLoanSearchRequest(searchTerm);
    }
});
//pass input as a request send GET request, to users, checking user's id and it's loans
const usersLoanSearchRequest = function (searchTerm) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/users/" + searchTerm + "/loans";
  xhttp.addEventListener('load', processLoanResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}

const createResetButton = function(){

  var resetButton = document.createElement('input');
  resetButton.type = "button";
  resetButton.className = "button search-button";
  resetButton.value = "Reset search";

  resetButton.addEventListener('click', function() {
      window.location.reload()
  });
  let outputDiv = document.getElementById("loans-output");
  let newItem = document.createElement("tr");
  newItem.appendChild(resetButton);
  outputDiv.appendChild(newItem)
}

//################# L3 - GET USER CURRENTLY BORROWING A BOOK #####################################


//Process response, if status 200, filter all loans, pass the loan that has the book, then loop through to display its details
//FURTHER DETAILS PROVIDED IN DOCUMENTATION UNDER LOANS SECTION
const processbookLoanedToResponse = function(response) {
  if (response.target.status == 200){
    let loans = JSON.parse(this.response);
    var searchTerm = document.querySelector("#select-book-id").value;
    let filteredLoans = []
    loans.forEach(function(loan){
      if (searchTerm == loan.BookId && loan.dueDate){
        filteredLoans.push(loan)
      }
    });


    populateTableItems(filteredLoans);

    createResetButton()

    if(filteredLoans.length == 0){ //if no loans found, display message:
      let outputDiv = document.getElementById("loans-output");
      let newItem = document.createElement("tr");
      newItem.appendChild(document.createTextNode("No loans found!"));
      outputDiv.appendChild(newItem);
    }
    searchTerm = document.querySelector("#select-book-id").value = "";
    // clear input form
 }else{
     let outputDiv = document.getElementById("loans-output");
     let newItem = document.createElement("tr");
     newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
     outputDiv.appendChild(newItem);
   }
};

//retrieve input
let searchBookLoan = document.getElementById("button-user-borrowing-book");
searchBookLoan.addEventListener("click", function() {
    let searchTerm = document.getElementById("select-book-id").value;


    if (searchTerm) {
        bookLoanedToSearchRequest(searchTerm);
    }
});
//pass input as a request, GET all loans
const bookLoanedToSearchRequest = function (searchTerm) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans";
  xhttp.addEventListener('load', processbookLoanedToResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}

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
