const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ error: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/books', async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`/books/${req.params.isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});




// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`/books/${req.params.author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`/books/${req.params.title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        if (books[isbn].reviews) {
            res.send(JSON.stringify(books[isbn].reviews, null, 4));
        } else {
            res.status(404).json({message: "No reviews found for this book"});
        }
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
