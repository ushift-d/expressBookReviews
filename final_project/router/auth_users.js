const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {username: "david", 
  password: "chege"}
];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const authuser = users.filter((user) =>{
    return (user.username === username && user.password === password)
  });
  if (authuser.length > 0) {
    return true;
  } else {
    return false;
  } 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		return res.status(404).json({message: "Error log in!"});
	}
	
	if (authenticatedUser(username, password)){
		let accessToken = jwt.sign ({
			data: password
		}, 'access', {expiresIn: 60 * 60});
		
		req.session.authorizition = {
			accessToken, username
		}
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({message: "Invalid Login1. Check username and password"});
	}
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
