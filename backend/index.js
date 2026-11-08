const port = 4000;
const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2/promise"); // Use promise-based API
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(cors());

// Use promise-based connection
let sql;

(async () => {
  try {
    sql = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Dhruvtiger@1708',
      database: 'songkaraoke',
    });
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

app.get('/', (req, res) => {
  res.send('Express app is running');
});

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('book'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

app.get('/songs', async (req, res) => {
  try {
    const [results] = await sql.query('SELECT * FROM songs');
    res.status(200).send(results);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

app.get('/song/:song_id', async (req, res) => {
  const { song_id } = req.params;
  try {
    const [results] = await sql.query('SELECT * FROM songs WHERE song_id = ?', [song_id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }
    const song = results[0];
    if (song.timings) {
      try {
        song.timings = JSON.parse(song.timings);
      } catch (error) {
        console.error('Error parsing timings:', error);
      }
    }
    res.status(200).json(song);
  } catch (err) {
    console.error('Error fetching song:', err);
    res.status(500).json({ error: 'Error fetching the song' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ success: true, user: { name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await sql.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true,message:'login succesfully', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error:" + error);
  }
});
