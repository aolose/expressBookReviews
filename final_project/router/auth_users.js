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
    const {text} = req.body
    const book = books[isbn]
    if (book) {
        const v = book.reviews
        v[req.session.authorization['username']] = {
            data: Date.now(), text
        }
        return res.send('submit success!')
    } else return res.status(404).json({message: "no matched isbn"});
});
regd_users.delete("/auth/review/:isbn", (req, res, next) => {
    const isbn = req.params['isbn']
    const book = books[isbn]
    if (book) {
        const v = book.reviews
        delete v[req.session.authorization['username']]
        return res.send('delete success!')
    } else return res.status(404).json({message: "no matched isbn"});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
