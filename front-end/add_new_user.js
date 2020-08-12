const baseUrl = "http://127.0.0.1:3000";

//################# U1 - ADD NEW USER ######################################

//definined response process for add new user request
const processAddResponse = function(response) {
//if status is 200, a message is displayed to the user, with their input, showing this has been added to the database
  if (response.target.status === 200){
    user = JSON.parse(this.response);
    let addedUserOutput = document.querySelector("#added-user-output");
    addedUserOutput.innerHTML = "";

    //retrieving values respective values from the response:
    let addUserName = user.name;
    let addUserBarcode = user.barcode;
    let addMemberType = user.memberType;
    let addUserId = user.id;

    //new user displayed information:
    let userAddedMessage = document.createTextNode(`ADDED TO USERS PAGE: User Id: ${addUserId},  NAME: ${addUserName}, BARCODE: ${addUserBarcode}, MEMBER TYPE: ${addMemberType}`); //left out ID: ${addUserID},
    let userAddedContainer = document.createElement("li");
    userAddedContainer.appendChild(userAddedMessage);
    addedUserOutput.appendChild(userAddedContainer)
  }
  //404 code added in users.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
    addedUserOutput.innerHTML = "Invalid details provided";
  }
  else{
    addedUserOutput.innerHTML = "ERROR INCURRED - Something went wrong";
  }
  //clear form's inputs
  let addUserName = document.querySelector("#add-user-name").value = "";
  let addUserBarcode = document.querySelector("#add-user-barcode").value = "";
}


//retrieve input
let addUserButton = document.querySelector("#add-user");
addUserButton.addEventListener("click", function() {
//select value from new user name input, select barcode input
  let addUserName = document.querySelector("#add-user-name").value;

//checking if barcode is correct format:
  let userInput = document.querySelector("#add-user-barcode").value;
  let userInputLength = userInput.length

  if (userInputLength == 6 && !isNaN(userInput)){
    addUserBarcode = document.querySelector("#add-user-barcode").value;
  }
//error message displayed if format is incorrect:
  else{
    let addedUserOutput = document.querySelector("#added-user-output");
    let userAddedMessage = document.createTextNode("Wrong barcode type added, must contain 6 digits");
    let userAddedContainer = document.createElement("li");
    userAddedContainer.appendChild(userAddedMessage);
    addedUserOutput.appendChild(userAddedContainer);
    addUserBarcode = false

  }
//retrieving radio input value, whether student or staff member selected.
  if (document.getElementById("search-term-author").checked){
      addMemberType = document.getElementById("search-term-author").value;
  }
  else if (document.getElementById("search-term-student").checked){
    addMemberType = document.getElementById("search-term-student").value;
  }

//creating a new object, only if all inputs are valid,
  if (addUserName && addUserBarcode && addMemberType) {
      newUserDetails = {

        "name":addUserName,
        "barcode":addUserBarcode,
        "memberType":addMemberType
      };
    //  calling a POST request function, passing in the new object
      addUserRequest(newUserDetails);
  };
});

//pass input as a request, POST request sent to users database, with new details entered
const addUserRequest = function (newUserDetails) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/users";
  xhttp.open('POST', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processAddResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newUserDetails));
}
