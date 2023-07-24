const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBook = (field, key) => async (req, res) => {
    const sc = req.params[field]?.toLowerCase()
    const bk = await books.load()
    const booksData = Object.entries(bk)
        .map(([k, v]) => ({...v, isbn: k}))
    let data = booksData.filter(a => {
        const f = a[field].toLowerCase()
        if (field === 'isbn') return f === sc
        if (sc) return f.includes(sc)
    })
    if (key) data = data.map(a => a[key])
    return res.json(data)
}

public_users.post("/register", (req, res) => {
    const {username, password} = req.body
    if (!password || !username) return res.status(404).json({message: "Unable to register user."});
    else if (isValid(username)) {
        users.push({username, password})
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(500).json({message: "user already exist."});
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.json(booksData)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', getBook('isbn'));

// Get book details based on author
public_users.get('/author/:author', getBook('author'));

// Get all books based on title
public_users.get('/title/:title', getBook('title'));

//  Get book review
public_users.get('/review/:isbn', getBook('isbn', 'reviews'));

module.exports.general = public_users;
