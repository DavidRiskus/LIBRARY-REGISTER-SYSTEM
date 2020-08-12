const baseUrl = "http://127.0.0.1:3000";

//METHOD RETRIEVED FROM: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
//AUTHOR: MDN web docs

//checking if the current location's URL contains the loan_id parameter.
const urlParams = new URLSearchParams(window.location.search);
window.onload = function(){
  //if the parameter is present, GET request is sent to retrieve loan's details.
  if(urlParams.has('loan_id')) {
    let loanId = urlParams.get('loan_id')
    console.log(loanId);
    // AJAX
    getLoanDetails(loanId);
  } else{//HANDLE ERROR IF LOAN ID WAS NOT PROVIDED.
    handleInvalidState("No User ID provided")
  }
}

const processSearchResponse = function(response) {
  //IF RESPONSE IS SUCCESSFULL, FORM INPUT FIELDS ARE POPULATED WITH THE RESPONSE CONTAINED VALUES:
  if (response.target.status === 200){
    window.loan = JSON.parse(this.response);

    //Retrieved from: https://stackoverflow.com/questions/14245339/pre-populating-date-input-field-with-javascript
    //Author: Robin Drexler - used to populate the calendar

    document.getElementById("due-date").value = new Date(window.loan.dueDate).toISOString().substring(0, 10);


  }
  else if(response.target.status === 404){//Handle error if incorrect/non-existing user id provided.
    handleInvalidState("Invalid loan ID")
  }
  else{
    handleInvalidState("ERROR INCURRED - Something went wrong")
  }

}

//DEFINED FUNCTION TO HANDLE ERROR ACCORDINGLY:
const handleInvalidState = function(message) { //FUNCTION TAKES MESSAGE AS ARGUMENT, TO HANDLE ERRORS RELATED TO INCORRECT OR NO USER ID PROVIDED
  let outputDiv = document.getElementById("loans-list");
  outputDiv.innerHTML = message;
  let form = document.getElementById("update-form")
  form.style.display = "none"; //FORM IS HIDDEN FROM THE USER TO AVOID HUMAN-ERROR.
}

//using Loan Id as input, sending GET request, to retrieve loan's details
const getLoanDetails = function (loanId) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans/" + loanId;
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}


//################# L* - UPDATE LOAN'S DETAILS #####################################

//definined response process for add new user request
const processUpdateResponse = function(response) {
  //if status is 200, a message is displayed to the user, with their input, showing this has been updated to the database
  let outputDiv = document.querySelector("#loans-list");
  if (response.target.status === 200){
    window.loan = JSON.parse(this.response);
    outputDiv.innerHTML = "";

    //retrieving values respective values from the response:
    let loanId = window.loan.UserId;
    let bookId = window.loan.BookId;
    let dueDate = new Date(window.loan.dueDate).toLocaleString();

    //new user displayed information:
    let message = document.createTextNode(` USER ID: ${loanId}, BOOK ID: ${bookId}, Loan Updated to DUE DATE: ${dueDate}`); //ID: ${selectUserID},
    let container = document.createElement("li");
    container.appendChild(message);
    outputDiv.appendChild(container)
  }
  //404 code added in loans.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
    outputDiv.innerHTML = "Invalid details provided";
  }
  else{
    outputDiv.innerHTML = "ERROR INCURRED - Something went wrong";
  }

}




//retrieve input
let updateLoanButton = document.querySelector("#button-update-loan");
updateLoanButton.addEventListener("click", function() {

  //select value from duedate input
  let dueDate = document.querySelector("#due-date").value;

  //check if date is the right format:
  let parsedDueDate = new Date(dueDate)

  //if the format is correct, then new loan details object is created
  if (parsedDueDate !== 'Invalid Date') {
      newLoanDetails = {

        "dueDate": parsedDueDate,
      };
      //object is passed into a function with a POST request.
      updateLoanRequest(newLoanDetails);
  //if the format is incorrect, invalit date message is displayed
  } else{
      let outputDiv = document.querySelector("#loans-list");
      let message = document.createTextNode(`Incorrect Date`);
      let container = document.createElement("li");
      container.appendChild(message);
      outputDiv.appendChild(container)
  }
});

//pass input as a request
const updateLoanRequest = function (newLoanDetails) {

  var xhttp = new XMLHttpRequest();
  //User.Id and Book.Id are turned into a global variables, and are available from initial GET loan request
  var queryUrl = baseUrl + "/users/" + window.loan.UserId + "/loans/" + window.loan.BookId;
  xhttp.open('POST', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processUpdateResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newLoanDetails));
}
