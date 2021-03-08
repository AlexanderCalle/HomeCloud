// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail');

// Send email with code
router.post('/sendemail/:email', (req, res) => {

    con.query('SELECT id FROM users WHERE email = ?', req.params.email, (err, users) => {
        if(err) return res.status(500).send(err);

        const code = Math.floor(1000000 + Math.random() * 9999999);

        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;
        }
        var date = new Date().addHours(2).toJSON().slice(0, 19);

        const data = {
            resetPasswordCode: code,
            resetPasswordExpired: date
        }

        con.query('UPDATE users SET ? WHERE email = ?', [data, req.params.email], (err, result) => {
            if (err) return res.status(500).send(err);

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: req.params.email, // Change to your recipient
                from: 'callebauta@hotmail.com', // Change to your verified sender
                subject: 'Reset password HomeCloud',
                text: 'Your code to reset your email is \n\ Code: ' + code,
            }

            sgMail.send(msg)
                .then(() => {
                    console.log('Email sent');
                    res.status(200).send("Ok");
                })
                .catch((error) => {
                    console.error(error)
                })
        })

    })

});
// check if code is valid 
router.post('/checkcode/:email/:code', (req, res) => {
    var date = new Date().toJSON().slice(0, 19)
    con.query('SELECT * FROM users WHERE resetPasswordCode = ? AND resetPasswordExpired > ?', [req.params.code, date], (err, user)=> {
        if (err) return res.status(500).send(err);
        if(!user[0]) return res.status(404).send("No token or expired");
        res.status(200).send('ok');
    });
})
// check if code is valid 
router.get('/code/:email/:code', (req, res) => {
    var date = new Date().toJSON().slice(0, 19)
    con.query('SELECT * FROM users WHERE resetPasswordCode = ? AND resetPasswordExpired > ?', [req.params.code, date], (err, user)=> {
        if (err) return res.status(500).send(err);
        if(!user[0]) return res.status(404).send("No token or expired");
        res.status(200).send('ok');
    });
});
// Update user with new password
router.post('/newpassword/:email/:code', (req, res) => {
    var date = new Date().toJSON().slice(0, 19)
    con.query('SELECT * FROM users WHERE resetPasswordCode = ? AND resetPasswordExpired > ?', [req.params.code, date], (err, user)=> {
        if(err) return res.status(500).send(err);
        if(!user[0]) return res.status(404).send("No token or expired");
        if(req.body.password) {
            bcrypt.hash(req.body.password, 11, (err, hash)=> {
                const data = {
                    password_hash: hash,
                    resetPasswordCode: null,
                    resetPasswordExpired: null,
                }

                con.query('UPDATE users SET ? WHERE resetPasswordCode = ? AND email = ?', [data, req.params.code, req.params.email], (err, user)=> {
                    if(err) return res.status(500).send(err);
                    res.status(200).send("Password changed")
                });
            });
        }
    });
})

module.exports = router;