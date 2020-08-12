const baseUrl = "http://127.0.0.1:3000";



//################# GET ALL USERS INSIDE A TABLE ######################################


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
    let headingContainer = document.getElementById("users-table-head");
    document.getElementById("users-table-head").innerHTML = "";
    headingContainer.appendChild(outputDivHeadings);

    // TABLE'S BODY OUTPUT
    let outputDiv = document.getElementById("users-output");
    document.getElementById("users-output").innerHTML = "";

    //headings

    addTableHeadings(outputDivHeadings, "ID");
    addTableHeadings(outputDivHeadings, "Name");
    addTableHeadings(outputDivHeadings, "Barcode");
    addTableHeadings(outputDivHeadings, "User Type");
    addTableHeadings(outputDivHeadings, "User Created");
    addTableHeadings(outputDivHeadings, "User Updated");
    addTableHeadings(outputDivHeadings, "Update User");
    addTableHeadings(outputDivHeadings, "Delete User");

    //take the global variable, containing users array, loop through, to populate their details into the table

    window.users.forEach(function(user){
        //retrieve the input value from search bar
        let searchBar = document.getElementById("user-details");
        let searchTerm = searchBar.value;

        //################# U2 - SEARCH USER'S DETAILS BY NAME OR BARCODE ######################################
        //if the search term does not match any charachter's continue populating the whole table
        if(!user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !user.barcode.toLowerCase().includes(searchTerm.toLowerCase())){
           return;
        }

        //create a row per user
        var tr = document.createElement('tr');

        //create nodes, with user's individual deatails
        let nodes = [
            document.createTextNode(user.id),  document.createTextNode(user.name),
            document.createTextNode(user.barcode), document.createTextNode(user.memberType),
            document.createTextNode(new Date(user.createdAt).toLocaleString()),
            document.createTextNode(new Date(user.updatedAt).toLocaleString())
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

        //location origin is taken, creating a new url that can contain individual user's id.
        btn.addEventListener('click', function() {
            let origin = location.origin
            location.href= origin + '/update_user.html?user_id=' + user.id
        });

        btn.type = "button";
        btn.className = "button table-button black";
        btn.value = "edit";

        //iteration continues, edit button is added to the same user's row, each user user's row has this button
        var tdEdit = document.createElement('td');
        tdEdit.appendChild(btn);
        tr.appendChild(tdEdit)

        //DELETE FUNCTION

        //delete button created
        var btn2 = document.createElement('input'); //EXTRA FEATURE (SAFETY)

        //delete button clicked, Confirmation alert pops up, if ok, clicked user.id is passed into deleteUser function
        //also global user id variable is made, to be used later for deleting any loans if that user had.
        btn2.addEventListener('click', function() {
          let confirmed = confirm("Do you really want to delete User: " + user.name + "?")
          if(confirmed){
            window.userId = user.id;
            console.log(window.userId);
            deleteUser(window.userId)
          }
        });

        //iteration continues, delete button is added to the same user's row, each user user's row has this button
        btn2.type = "button";
        btn2.className = "button table-button sky";
        btn2.value = "delete";
        var tdDelete = document.createElement('td');
        tdDelete.appendChild(btn2);
        tr.appendChild(tdDelete)

        outputDiv.appendChild(tr)

        });

  }
  //RELOAD PAGE AFTER USER WAS DELETED
  const processDeleteUser = function(response){
    window.location.reload() //reload the page to reflect deletion of an item
  }

  //DELETE REQUEST - DELETE USER
  const deleteUser = function (userId) {

    var xhttp = new XMLHttpRequest();
    var queryUrl = baseUrl + "/users/" + userId;
    xhttp.addEventListener('load', processDeleteUser);
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
    console.log(response);
    if (response.target.status == 200){
      let loans = JSON.parse(this.response);


      //IF ANY OF THE LOANS' UserId matches the deleted user.id, then the respective loan will be deleted, deleteLoan function is called
      //loan's id is passed in, a false value passed, to not do any response handling.
      loans.forEach(function(loan){
        if (loan.UserId == window.userId) {
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
  window.location.reload()
  }

  //DELETE LOAN RELATING TO DELETED USER
  const deleteLoan = function (loanId, needHandling=true) {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/loans/" + loanId;
  if(needHandling){
    xhttp.addEventListener('load', processDeleteLoan);
  }
  xhttp.open('DELETE', queryUrl);
  xhttp.send();
  }


// HANDLE USER GET REQUEST
const processSearchResponse = function(response) {

  // IF RESPONSE IS SUCCESSFUL AND RETURNS STATUS 200, ESTABLISH A GLOBAL VARIABLE USERS, AND CALL
  //FUNCTION TO LOOP THROUGH ALL USERS, DYNAMICALLY CREATING A TABLE
  if (response.target.status == 200){
    window.users = JSON.parse(this.response);//global variable
    populateTableItems()

  }
  // IF RESPONSE IS NOT STATUS 200, DISPLAY AN ERROR MASSAGE TO USER, DYNAMICALLY CREATING A ROW INSIDE A TABLE
  else{
    let outputDiv = document.getElementById("users-output");
    let newItem = document.createElement('tr');
    newItem.appendChild(document.createTextNode("ERROR INCURRED - Something went wrong"));
    outputDiv.appendChild(newItem);
  }
};

//PAGE LOADS UP ONCE ACCESSED

window.addEventListener("load", function(){
  console.log("page loaded");

  // CALL FUNCTION WITH GET REQUEST
  userSearchRequest();
})

//GET REQUEST SENT TO ALL USERS ENDPOINT
const userSearchRequest = function () {

  var xhttp = new XMLHttpRequest();
  var queryUrl = baseUrl + "/users";
  xhttp.addEventListener('load', processSearchResponse);
  xhttp.open('GET', queryUrl);
  xhttp.send();
}




//Check Search bar
let searchBar = document.getElementById("user-details");
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
