const createError = require("http-errors");
const express = require("express");
const cors = require("cors"); //allows to deal with requests that are not on same origin as we are, gets from other servers
const db = require("./data");

let authorsRouter = require("./routes/authors"); //
let booksRouter = require("./routes/books");
let usersRouter = require("./routes/users");
let loansRouter = require("./routes/loans");
let searchRouter = require("./routes/search");

let server = express();

// interpret JSON body of requests
server.use(express.json()); //just says requests will be made only those that will have JSON in there, says deal with query strings I wont be denoting with "?" "&" etc. you do it

// interpret url-encoded queries
server.use(express.urlencoded({ extended: false }));

// allow CORS
server.use(cors());

// allow CORS preflight for all routes
server.options("*", cors());

server.use("/authors", authorsRouter); //any requests for authors will have to go to the respective Router
server.use("/books", booksRouter); //these routers link up
server.use("/users", usersRouter); // "/authors/1" would go to 1st author?
server.use("/loans", loansRouter);
server.use("/search", searchRouter);

// handle errors last
server.use(function(err, req, res, next) {
    res.status = err.status || 500; //if the request end is not /"authors" etc. one of above, then send the 500 error
    res.send(err);
});

// connect to the database and start the server running
db.initialiseDatabase(false, null);
server.listen(3000, function() {
    console.log("server listening");
});
