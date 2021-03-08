// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');

// Search for a friend
router.get('/:userId/:query', (req, res) => {
    const query = `SELECT u.id, u.firstname, u.lastname, u.email, u.profile_pic FROM users u LEFT JOIN friends b ON u.id IN (b.UserOne, b.UserTwo) AND ? IN (b.UserOne, b.UserTwo) WHERE CONCAT ( u.firstname, ' ', u.lastname ) LIKE ? AND u.id <> ? AND b.Status = "1"`

    con.query(query, [req.params.userId, req.params.query + '%', req.params.userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(result)
    })
});
// Searcg for files and folders
router.get('/find/file/folders/:userId/:query', (req, res)=> {
    console.log(req.params.query + "%", req.params.userId);
    con.query('SELECT * FROM files WHERE name LIKE ? AND user_id = ?', [req.params.query + "%", req.params.userId], (err, files) => {
        if (err) return res.status(500).send(err);
        con.query('SELECT * FROM folders WHERE name LIKE ? AND user_id = ?', [req.params.query + "%", req.params.userId], (err, folders) => {
            if (err) return res.status(500).send(err);
            res.status(200).send({
                files: files,
                folders: folders
            })
        })
    })
})

module.exports = router;