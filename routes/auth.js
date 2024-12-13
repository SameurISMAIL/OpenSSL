const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const fs = require('fs');
const path = require('path');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { first_name, last_name, phone_number, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (first_name, last_name, phone_number, username, password) VALUES (?, ?, ?, ?, ?)', 
    [first_name, last_name, phone_number, username, hashedPassword], (err, result) => {
        if (err) throw err;

        // Créer un fichier texte avec les informations d'identification
        const filePath = path.join(__dirname, '../credentials.txt');
        const fileContent = `First Name: ${first_name}\nLast Name: ${last_name}\nPhone Number: ${phone_number}\nUsername: ${username}\nPassword: ${password}`;
        fs.writeFileSync(filePath, fileContent);

        // Télécharger le fichier texte
        res.download(filePath, 'credentials.txt', (err) => {
            if (err) throw err;
            // Supprimer le fichier après téléchargement
            fs.unlinkSync(filePath);
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                // Créer un fichier texte avec les informations d'identification
                const filePath = path.join(__dirname, '../credentials.txt');
                const fileContent = `Username: ${username}\nPassword: ${password}`;
                fs.writeFileSync(filePath, fileContent);

                // Télécharger le fichier texte
                res.download(filePath, 'credentials.txt', (err) => {
                    if (err) throw err;
                    // Supprimer le fichier après téléchargement
                    fs.unlinkSync(filePath);
                });
            } else {
                res.send('Incorrect password');
            }
        } else {
            res.send('User not found');
        }
    });
});

module.exports = router;