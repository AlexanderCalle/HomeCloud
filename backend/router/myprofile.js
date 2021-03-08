// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');
const multer = require('multer');

// Multer middleware
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './upload/profilePic/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${req.params.userId + '.' + file.originalname.split('.')[1]}`)
    }
  })

let upload = multer({ storage: storage})
// Get user data
router.get('/:userid', (req, res)=>{
    con.query('SELECT email, firstname, lastname, id, profile_pic FROM `users` WHERE id = ?', req.params.userid, (err, user)=> {
        if (err) return res.status(500).send(err);

        let foldersLength = 0;
        let friendsLength = 0;
        let filesLength = 0;
        
        con.query('SELECT * FROM files WHERE user_id = ?', req.params.userid , (err, files)=> {
            if (err) return res.status(500).send(err);
            filesLength = files.length;
            con.query('SELECT * FROM folders WHERE user_id= ?', req.params.userid, (err, folders)=> {
                if (err) return res.status(500).send(err);
                foldersLength = folders.length;
                con.query('SELECT FriendsId FROM `friends` WHERE UserOne = ? OR UserTwo = ? AND Status = 1', [req.params.userid, req.params.userid], (err, friends)=> {
                    if (err) return res.status(500).send(err);
                    friendsLength = friends.length;
                    res.status(200).send({
                        user: user[0],
                        files: filesLength,
                        folders: foldersLength,
                        friends: friendsLength
                    });
                });
            });
        });

    });
});
// Update user data
router.post('/updateuser/:userId', async (req, res) => {
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
    }

    con.query('UPDATE `users` SET ? WHERE id = ?', [data, req.params.userId], (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send('ok')
    })
});
// Updates users profile pic
router.post('/uploadPic/:userId', upload.single('file'), (req, res) => {

    const path = `/profilePic/${req.params.userId + '.' + req.file.originalname.split('.')[1]}`

    con.query('UPDATE `users` SET profile_pic = ? WHERE id = ?', [path, req.params.userId], (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send({
            profile_pic: path
        })
    })
});

module.exports = router;