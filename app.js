const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // Ajouter cette ligne pour servir les fichiers statiques

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '&&aaAA123buzimol11',
    database: 'auth_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(options, app).listen(3000, () => {
    console.log('Server started on port 3000 with HTTPS');
});