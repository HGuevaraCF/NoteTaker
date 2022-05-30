const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3000;
// .listen(process.env.PORT || 5000);

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readFromFile = util.promisify(fs.readFile);


const WriteFile = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

//Get route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Get route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Route for posting note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    const {title, text} = req.body;
    if(req.body){
        const newNote = {
            title: title,
            text: text,
            id: uuid()
        };
        WriteFile(newNote, './db/db.json');
        res.json('Note added succesfully');
    }else{
        res.error('Error adding note');
    }
});

//Route for getting notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);