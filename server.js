const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8')); //file being read is the db.json under db folder & parsing the data from the db.json file

let app = express();
let PORT = process.env.PORT || 5000;

//creates a randomly generated ID for each of the note entries
var createId = () => {
    return 'id-' + Math.random().toString(36).substring(2, 16);
  };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public/'));

//path to send file to homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//path to send files to notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//API path for the notes page. Will return entrie(s) in the json file when calling this API 
app.get("/api/notes", (req, res) => {
    console.log(notes);
    return res.json(notes);
    });

//default route
app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

//api route to create new notes and save them to the db.json file
app.post("/api/notes", (req,res) => {
    let newNote = req.body;
    newNote.id = createId();
    notes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
})

//api route to delete notes based on the created id
app.delete("/api/notes/:id", (req, res) => {
    let noteDelete = req.params.id;

    for (let i = 0; i < notes.length; i++) {
        if (noteDelete === notes[i].id) {
            notes.splice(i,1);
            fs.writeFileSync("./db/db.json", JSON.stringify(notes));
            return res.json(notes);
        }
    }
    return res.json(false);
})

// Starts the server to begin listening
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });