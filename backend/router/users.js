// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');

// Get all searched users
router.get('/search/:userId/:query', async (req, res) => {  
    const userId  = req.params.userId;
    const query = `SELECT u.id, u.firstname, u.lastname, u.email, u.profile_pic, b.Status FROM users u LEFT JOIN friends b ON u.id IN (b.UserOne, b.UserTwo) AND ? IN (b.UserOne, b.UserTwo) WHERE CONCAT ( u.firstname, ' ', u.lastname ) LIKE ? AND u.id <> ?`

    con.query(query, [userId, req.params.query + '%', userId], async (err, result) => {
        if(err) console.log(err);

        res.status(200).send(result);
    })
});
// Get all friends
router.get('/friends/:userId', (req, res)=> {
    const userId = req.params.userId;
    con.query(`SELECT * FROM friends AS F , users AS U WHERE CASE WHEN F.UserOne = ? THEN F.UserTwo = U.id WHEN
    F.UserTwo = ? THEN F.UserOne = U.id END AND F.Status = 1`, [userId, userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        if(result.length != 0) {
            res.status(200).send(result);
        }
    })
});
// Add a friend method:Post
router.post('/addFriend', (req, res) => {

    const userId = req.body.userId;
    const friendId = req.body.friendId;

    con.query('SELECT FriendsId, Status, UserOne, UserTwo from friends WHERE CASE WHEN UserOne = ? THEN UserTwo = ? WHEN UserTwo = ? THEN UserOne = ? END', [userId, friendId, userId, friendId], (err, result)=> {
        if(err) console.log(err);
        
        if(result[0] === undefined) {
            const data = {
                UserOne: req.body.userId,
                UserTwo: req.body.friendId,
                Status: 0
            }

            con.query('INSERT INTO friends SET ?', data, (err, result)=> {
                if(err) return res.status(500).send(err);
                res.status(200).send(result);
            })
        } else if(result[0].Status == 2) {
            const data = {
                UserOne: req.body.userId,
                UserTwo: req.body.friendId,
                Status: 0
            }

            con.query('UPDATE `friends` SET ? WHERE FriendsId = ?', [data, result[0].FriendsId], (err, result)=> {
                if(err) console.log(err);
                res.status(200).send(result);
            })
        }

    })
});
// Get all friend requests
router.get('/friendrequests/:userId', (req, res)=> {
    const userId = req.params.userId;

    con.query(`SELECT * FROM friends AS F , users AS U WHERE CASE WHEN F.UserTwo = ? THEN F.UserOne = U.id END AND F.Status = 0`, [userId, userId], (err, result) => {
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});
// Update friend request
router.post('/updateRequest/:FriendsId', (req, res)=> {
    con.query('UPDATE `friends` SET `Status` = ? WHERE FriendsId = ?', [req.body.Status, req.params.FriendsId], (err, result)=>{
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});
// Delete a friend
router.get('/deleteFriend/:FriendsId/:userId', (req, res)=> {
    con.query('DELETE FROM `friends` WHERE  ? in (UserOne, UserTwo) AND ? in (UserOne, UserTwo)', [req.params.FriendsId, req.params.userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        con.query('DELETE FROM messages WHERE ? in (fromUser, toUser) AND ? in (fromUser, toUser)', [req.params.FriendsId, req.params.userId], (err, result) => {
            if(err) return res.status(500).send(err);
        
            con.query('DELETE FROM `chats` WHERE ? in (UserOne, UserTwo) AND ? in (UserOne, UserTwo)', [req.params.FriendsId, req.params.userId], (err, chat) => {
                if (err) return res.status(500).send(err);
                res.status(200).send('Deleted')
            })

        })
    })
});
// Get all friends
router.get('/allfriends/:userId', (req, res)=> {
    con.query('SELECT u.firstname, u.lastname, u.profile_pic, f.created, u.id FROM `friends` f LEFT JOIN `users` u on ? in (f.UserOne, f.UserTwo) AND Status = 1 AND U.id <> ? WHERE u.id = f.UserTwo OR u.id = f.UserOne', [req.params.userId, req.params.userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});

module.exports = router;