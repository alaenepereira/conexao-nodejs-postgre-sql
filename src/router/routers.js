const express = require("express");
const { addBook, listBooksById, listBooks, registerAuthor, getAuthor } = require("../controllers/books");

const router = express();

router.post("/autor", registerAuthor);
router.get('/autor/:id', getAuthor);
router.post("/autor/:id/livros", addBook);
router.get("/autor/:id/livros",listBooksById );
router.get("/livros", listBooks)


module.exports = router