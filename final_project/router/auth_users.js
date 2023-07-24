const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.findIndex((user) => {
        return (user.username === username)
    }) === -1;
}

const authenticatedUser = (name, pwd) => { //returns boolean
    console.log(users, name, pwd)
    return users.findIndex(({username, password}) => name === username && pwd === password) !== -1;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params['isbn']
    const {id=Date.now(),text} = req.body
    const book = books[isbn]
    if (book){
        const v = book.reviews
        v[id]=text
        return res.status('submit success!')
    }else  res.status(404).json({message: "no matched isbn"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
