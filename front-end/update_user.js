const baseUrl = "http://127.0.0.1:3000";

//METHOD RETRIEVED FROM: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
//AUTHOR: MDN web docs

//checking if the current location's URL contains the user_id parameter.
const urlParams = new URLSearchParams(window.location.search);
window.onload = function(){
  //if the parameter is present, GET request is sent to retrieve user's details.
  if(urlParams.has('user_id')) {
    let userId = urlParams.get('user_id')
    // AJAX
    getUserDetails(userId);
  } else{//HANDLE ERROR IF USER ID WAS NOT PROVIDED.
    handleInvalidState("No User ID provided")
  }
}

const processSearchResponse = function(response) {
  //IF RESPONSE IS SUCCESSFULL, FORM INPUT FIELDS ARE POPULATED WITH THE RESPONSE CONTAINED VALUES:
  if (response.target.status === 200){
    let user = JSON.parse(this.response);

    document.getElementById("update-user-name").value = user.name
    document.getElementById("update-user-barcode").value = user.barcode;
    if (user.memberType === "Staff") {
      document.getElementById("search-term-staff").checked = true;

    }else {
      document.getElementById("search-term-student").checked = true;

    }
  }
  else if(response.target.status === 404){//Handle error if incorrect/non-existing user id provided.
    handleInvalidState("Invalid user ID")
  }
  else{
    handleInvalidState("ERROR INCURRED - Something went wrong")
  }

}

//DEFINED FUNCTION TO HANDLE ERROR ACCORDINGLY:
const handleInvalidState = function(message) { //FUNCTION TAKES MESSAGE AS ARGUMENT, TO HANDLE ERRORS RELATED TO INCORRECT OR NO USER ID PROVIDED
  let updateUserOutput = document.getElementById("update-user-output");
  updateUserOutput.innerHTML = message;
  let form = document.getElementById("update-form")
  form.style.display = "none"; //FORM IS HIDDEN FROM THE USER TO AVOID HUMAN-ERROR.
}

//using User Id as input, sending GET request, to retrieve user's details
const getUserDetails = function (userId) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/users/" + userId;
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}


//################# U3 - UPDATE USER'S DETAILS #####################################

//definined response process for update user request
const processUpdateResponse = function(response) {
  //if status is 200, a message is displayed to the user, with their input, showing this has been updated to the database
  if (response.target.status === 200){
    user = JSON.parse(this.response);
    let updateUserOutput = document.querySelector("#update-user-output");
    updateUserOutput.innerHTML = "";

    //retrieving values respective values from the response:
    let updateUserName = user.name;
    let updateUserBarcode = user.barcode;
    let updateMemberType = user.memberType;
    let updateUserId = user.id;
    //new user displayed information:
    let userUpdatedMessage = document.createTextNode(` User Id: ${updateUserId} NAME: ${updateUserName}, BARCODE: ${updateUserBarcode}, MEMBER TYPE: ${updateMemberType}`); //ID: ${selectUserID},
    let userUpdatedContainer = document.createElement("li");
    userUpdatedContainer.appendChild(userUpdatedMessage);
    updateUserOutput.appendChild(userUpdatedContainer)
  }
  //404 code added in users.js route, display invalid details provided, alternatively general error handling message:
  else if(response.target.status === 404){
    updateUserOutput.innerHTML = "Invalid details provided";
  }
  else{
    updateUserOutput.innerHTML = "ERROR INCURRED - Something went wrong";
  }
  //clear form's inputs
  let updateUserName = document.querySelector("#update-user-name").value = "";
  let updateUserBarcode = document.querySelector("#update-user-barcode").value = "";

}



//retrieve input
let updateUserButton = document.querySelector("#update-user");
updateUserButton.addEventListener("click", function() {
  //select value from updating user's name input, select barcode input

  let updateUserName = document.querySelector("#update-user-name").value;
  let updateUserBarcodeInput = document.querySelector("#update-user-barcode").value;

//checking if barcode is correct format:
  if (updateUserBarcodeInput.length == 6 && !isNaN(updateUserBarcodeInput)){
    updateUserBarcode = document.querySelector("#update-user-barcode").value;
  }
//error message displayed if format is incorrect:
  else{
    let updateUserOutput = document.querySelector("#update-user-output");
    let message = document.createTextNode("Wrong barcode type added, must contain 6 digits");
    let container = document.createElement("li");
    container.appendChild(message);
    updateUserOutput.appendChild(container)
    updateUserBarcode = false;
  }
//retrieving radio input value, whether student or staff member selected.
  if (document.getElementById("search-term-staff").checked){
      updateMemberType = document.getElementById("search-term-staff").value;
  }
  else if (document.getElementById("search-term-student").checked){
    updateMemberType = document.getElementById("search-term-student").value;
  }

//creating a new object, only if all inputs are valid,
  if (updateUserName && updateUserBarcode && updateMemberType) {
      newUserDetails = {
        "name":updateUserName,
        "barcode":updateUserBarcode,
        "memberType":updateMemberType
      };
      //  calling a PUT request function, passing in the new object
      updateUserRequest(newUserDetails);
  };
});

//pass input as a request, PUT request sent to users database, with new details entered
const updateUserRequest = function (newUserDetails) {
  // checking if user id is present inside the URL, passing it inside the queryUrl, to send newUserDetails to the correct Updating user.
  let userId = urlParams.get('user_id')
  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/users/" + userId;
  xhttp.open('PUT', queryUrl);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.addEventListener('load', processUpdateResponse);
  //object is turned into a string
  xhttp.send(JSON.stringify(newUserDetails));
}
