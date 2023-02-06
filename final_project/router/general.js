const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let message = req.body
  const {username, password} = req.body;
  
  if(!username || !password) {
    return res.send(message);
  }
  if(isValid(username)){
    return res.status(400).json({message: "User already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 res.send(JSON.stringify(books))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(JSON.stringify(books[`${isbn}`]))
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let asArray = Object.entries(books)
  const filtered = [];
 for (let i = 0; i < asArray.length; i++){
  if(asArray[i][1].author === author){
    filtered.push(asArray[i][1])
  }
 }
 res.send(JSON.stringify(filtered))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let asArray = Object.entries(books)
  const filtered = [];
 for (let i = 0; i < asArray.length; i++){
  if(asArray[i][1].title === title){
    filtered.push(asArray[i][1])
  }
 }
 res.send(JSON.stringify(filtered))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(JSON.stringify(books[`${isbn}`]['reviews']))
});

module.exports.general = public_users;
