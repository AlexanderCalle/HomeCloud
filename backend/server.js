const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const con = require('./connect');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3030;

dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('hello')
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    if(req.body.email != "" && req.body.password != "") {
        con.query('SELECT * FROM users WHERE email = ?', req.body.email, (err, result)=> {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if(bcrypt.compareSync(req.body.password, result[0].password_hash)) {
                return res.status(200).send({
                    email: email,
                    id: result[0].id
                })
            } else {
                return res.sendStatus(403);
            }
        });
    } else {
        return res.status(403).send("Not everything is filled in!")
    }
})

app.post('/register', (req, res) => {
    if(req.body.email != "" && req.body.password != "" && req.body.firstname != "" && req.body.lastname != "") {
        con.query('SELECT email FROM `users` WHERE email = ?', req.body.email, (err, result)=> {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if(result[0]){
                console.log(result);
                return res.sendStatus(403);
            } else {
                const generated_id = crypto.randomBytes(11).toString('hex');
                const password_hash = bcrypt.hashSync(req.body.password, 11);
                fs.mkdirSync(process.env.UPLOAD_FOLDER + generated_id + '/');
                const data = {
                    id: generated_id,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password_hash: password_hash,
                    folder_path: process.env.UPLOAD_FOLDER + generated_id + '/'
                }
                con.query('INSERT INTO `users` SET ?', data, (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.sendStatus(500)
                    }
                    return res.status(200).send({
                        email: data.email,
                        id: data.id,
                    })
                });
            }
            
        });
    } else {
        return res.status(403).send('')
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})