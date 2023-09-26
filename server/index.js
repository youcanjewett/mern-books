require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Book = require("./models/Books");
const multer = require("multer");

//creates express application
const app = express();
// env.PORT for when hosting online, 8000 for locally & needs to be different from react
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
//parsing incoming URL-encoded request data using qs libary and adding it to req.body
//object for easy access
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//fetch book(s)
app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const data = await Book.find(filter);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "an error occurred while fetching data" });
  }
});

// fetch book details
app.get("/api/books/:slug", async (req, res) => {
  try {
    const slugParam = req.params.slug;

    const data = await Book.findOne({ slug: slugParam });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "an error occurred while fetching data" });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // where the file will be saved
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
})

const upload = multer({ storage: storage })

//update book data
// upload.single is part of multer library - multer adds a body object
// and a file or files object to the request object. The body object 
// contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
app.post("/api/books", upload.single("thumbnail"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const newBook = new Book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    });

    await Book.create(newBook);
    res.json("Data submitted");
  } catch (error) {
    res.status(500).json({ error: "an error occurred while fetching data" });
  }
});

//editing a book
app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
  try {

    const bookId = req.body.bookId;

    const updateBook = {
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      
    };

    if(req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    await Book.findByIdAndUpdate(bookId, updateBook);
    res.json("Data submitted");
  } catch (error) {
    res.status(500).json({ error: "an error occurred while fetching data" });
  }
});


app.delete("/api/books/:id", async(req,res) => {
  const bookId = req.params.id;

  try {
    await Book.deleteOne({_id: bookId});
    res.json("How dare you!" + req.body.bookId);
  } catch (error) {
    res.json(error);
  }
})

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
