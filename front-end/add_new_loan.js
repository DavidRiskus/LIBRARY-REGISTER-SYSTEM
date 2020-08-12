const baseUrl = "http://127.0.0.1:3000";

//################# L1 - CREATE USER'S LOANS #####################################
//definined response process for add new user request
const processCreateLoanResponse = function(response) {
  if (response.target.status === 200){
  //if status is 200, a message is displayed to the user, with their input, showing this has been added to the database

    let loan = JSON.parse(this.response);

    let loanOutput = document.querySelector("#loan-output");
    loanOutput.innerHTML = "";

    //retrieving values respective values from the response:
    let selectLoanUserID = loan.UserId;
    let selectLoanBookID = loan.BookId;
    let dueDate = loan.dueDate;

    //new user displayed information:
    let loanAddedMessage = document.createTextNode(`LOAN CREATED/UPDATED FOR: USER ID:${selectLoanUserID}, BOOK ID:${selectLoanBookID}, DUE DATE:${dueDate}`); //left out ID: ${addUserID},
    let loanAddedContainer = document.createElement("li");
    loanAddedContainer.appendChild(loanAddedMessage);
    loanOutput.appendChild(loanAddedContainer)
  }
  //404 code added in loans.js route, display invalid details provided, alternatively general error handling message:

  else if(response.target.status === 404){
    let loanOutput = document.querySelector("#loan-output");
    loanOutput.innerHTML = "Invalid details provided, User id or Book id does not exist.";
  }
  else{
    let loanOutput = document.querySelector("#loan-output");
    loanOutput.innerHTML = "ERROR INCURRED - Something went wrong";
  }
  //clear form's inputs
  let selectLoanUserID = document.querySelector("#select-user-id").value = "";
  let selectLoanBookID = document.querySelector("#select-book-id").value = "";
  let dueDate = document.querySelector("#due-date").value = "";

}




//THIS FUNCTION CHECKS IF A BOOK HAS BEEN LOANED OUT TO A USER, OR IF A BOOK IS AVAILABLE, CREATE THE LOAN
const checkAllLoansResponse = function(response) {
  //if status comes back as 200, select all input values and loop through the loans.
  if (response.target.status === 200){

    let selectLoanUserID = document.querySelector("#select-user-id").value;
    let selectLoanBookID = document.querySelector("#select-book-id").value;
    let dueDate = document.querySelector("#due-date").value;

    let loans = JSON.parse(this.response);
    let found = false
    let dueDateStatus = null

//if search term for a book Id matches the loan.BookId property's value, the found variable updates to true, meaning a book is on loan.
    loans.forEach(function(loan){
        if(selectLoanBookID == loan.BookId){
          found = true;
          //found on loan book's due date is formated to a more readable format.
          dueDateStatus = new Date(loan.dueDate).toLocaleString()

        };
    });
    if (!found) { //if the loan with the book we are looking for is not found, then we create this loan
      newLoanDetails = {
        "dueDate":dueDate
      };
      //Function with a POST request is called, new loan details are provided, with the new due date.
      createLoanRequest(newLoanDetails);
    }else {
      //MESSAGE BOOK IS ALREADY ON LOAN:
      let loanOutput = document.querySelector("#loan-output");
      loanOutput.innerHTML = "";
      let message = document.createTextNode("The Book is currently on loan, due date: " + dueDateStatus);
      let container = document.createElement("li");
      container.appendChild(message);
      loanOutput.appendChild(container)
    }
    //if status is not 200, general error message is displayed.
  }else {
    let loanOutput = document.querySelector("#loan-output");
    loanOutput.innerHTML = "ERROR INCURRED - Something went wrong";
  };

}

//retrieve inputs
let createLoanButton = document.querySelector("#create-loan");
createLoanButton.addEventListener("click", function() {
  let selectLoanUserID = document.querySelector("#select-user-id").value;
  let selectLoanBookID = document.querySelector("#select-book-id").value;
  let dueDate = document.querySelector("#due-date").value;

  //calling a function with GET loans request, only if all inputs are valid,
  if (selectLoanUserID && selectLoanBookID && dueDate) {
    checkAllLoansRequest();
  }
  else{
    //Display error message, not all details entered:
    let loanOutput = document.querySelector("#loan-output");
    loanOutput.innerHTML = "";
    let message = document.createTextNode("Error: Not All Details Added.");
    let container = document.createElement("li");
    container.appendChild(message);
    loanOutput.appendChild(container)
  }

});

//sending a GET request to retrieve all loans
const checkAllLoansRequest = function () {
  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans";
  xhttp.addEventListener('load', checkAllLoansResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}


//pass input as request, new loan details will be used to create a loan.
const createLoanRequest = function (newLoanDetails) {
  var xhttp = new XMLHttpRequest();
  let selectLoanUserID = document.querySelector("#select-user-id").value; //retrieving user id input
  let selectLoanBookID = document.querySelector("#select-book-id").value; //retrieving book id input
  var queryUrl = baseUrl + "/users/" + selectLoanUserID + "/loans/" + selectLoanBookID; //sending the new loan details to a user's loans.
  xhttp.open('POST', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processCreateLoanResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newLoanDetails));
}
