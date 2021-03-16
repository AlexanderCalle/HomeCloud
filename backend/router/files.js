// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');
const fs = require('fs');
let chunks = [];
// Router files
// Create files out of chunks (stream)
let ws = null;
function writeStream(path) {
    console.log(path);
    ws = fs.createWriteStream(path)
}
// Put chunck inside the stream and write file
router.post('/UploadChunks', (req, res) => {
    var size = 0;
    req.on('data', function (data) {
        size += data.length;
        console.log('Got chunk: ' + data.length + ' total: ' + size);
        ws.write(data);
    });
    req.on('end', function () {
        console.log("total size = " + size);
        res.status(200).send("response");
    }); 
});
// Opens the stream to upload file(s)
router.get('/openStream/:userId/:foldername/:filename', async (req, res) => {
    let path = `./upload/${req.params.userId}/${req.params.foldername}/${req.params.filename}`;
    await writeStream(path);
    res.status(200).send('ok');
});
// Add file(s) method:Post
router.post('/addfiles/:user_id/:foldername/:filename', (req, res) => {
    ws.end();
    con.query('SELECT folder_id FROM `folders` WHERE name = ? AND user_id = ?',[req.params.foldername, req.params.user_id], async (err, result)=>{
        if(err) return res.status(500).send(err);
            con.query('SELECT * FROM `files` WHERE name = ? AND folder_id = ?', [req.params.filename, result[0].folder_id], (err, file) => {
                if(file[0] != undefined || file[0] != null) {
                    let is_image = 0;

                    let dataType = req.params.filename.split('.')[1].toLowerCase();

                    if(dataType === 'jpg' || dataType === 'jpeg' || dataType === 'png' || dataType === 'gif') {
                        is_image = 1;
                    }
            
                    const data = {
                        name: req.params.filename,
                        path: '/' + req.params.user_id + '/' + req.params.foldername + '/' + req.params.filename,
                        user_id: req.params.user_id,
                        folder_id: result[0].folder_id,
                        is_image: is_image
                    }
                    con.query('UPDATE `files` SET ? WHERE file_id = ?', [data, file[0].file_id], (err, result)=>{
                        if (err) return res.status(500).send(err);
                    }); 
                    res.status(200).send('ok');
                } else {
                    let is_image = 0;

                    let dataType = req.params.filename.split('.')[1].toLowerCase();

                    if(dataType === 'jpg' || dataType === 'jpeg' || dataType === 'png' || dataType === 'gif') {
                        is_image = 1;
                    }
            
                    const data = {
                        name: req.params.filename,
                        path: '/' + req.params.user_id + '/' + req.params.foldername + '/' + req.params.filename,
                        user_id: req.params.user_id,
                        folder_id: result[0].folder_id,
                        is_image: is_image
                    }
                    con.query('INSERT INTO `files` SET ?', data, (err, result)=>{
                        if (err) return res.status(500).send(err);
                    }); 
                    res.status(200).send('ok');
                }
            })
    });
});
// Rename a file method:Post
router.post('/renamefile/:folderId/:fileId', (req, res) => {
    const name = req.body.name;
    con.query('SELECT * FROM `files` WHERE folder_id = ? AND name = ?', [req.params.folderId, name], (err, result) => {
        if (err) return res.status(500).send(err);
        if(result[0] == undefined) {
            con.query('SELECT * FROM `files` WHERE file_id = ?', req.body.fileId, async (err, file) => {
                if(err) return console.log(err);

                const oldPath = './upload' + file[0].path;
                const newPath = `./upload/${req.body.userId}/${req.body.foldername}/${name}`
                const newPathDb = `/${req.body.userId}/${req.body.foldername}/${name}`
    
                await fs.renameSync(oldPath, newPath);

                const data = {
                    name: name,
                    path: newPathDb
                }

                con.query('UPDATE `files` SET ? WHERE file_id = ?', [data, req.body.fileId], (err, result) => {
                    if (err) return console.log(err);
                    res.status(200).send('ok')
                })
            });
        } else {
            
            res.status(201).send('There is already a file with this name');
            
        }
    })

});
// Delete a file
router.get('/deletefile/:fileId', (req, res) => {

    con.query('SELECT * FROM `files` WHERE file_id = ?', req.params.fileId, (err, files) => {
        if (err) return res.status(500).send(err);

        fs.unlinkSync('./upload' + files[0].path);
        con.query('DELETE FROM `files` WHERE file_id = ?', req.params.fileId, (err, result)=> {
            if (err) return res.status(500).send(err);
            res.status(200).send('ok')
        });

    });

});
// Share a file with friend method:Post
router.post('/sharefile', (req, res)=> {
    const data = {
        shared_file: req.body.shared_file,
        user_file: req.body.user_file,
        shared_user: req.body.shared_user
    }

    con.query('SELECT * FROM `shared` WHERE user_file = ? AND shared_user = ? AND shared_file = ?', [data.user_file, data.shared_user, data.shared_file], (err, result)=> {
        if (err) return res.status(500).send(err);
        if(result.length === 0) {
            con.query('INSERT INTO `shared` SET ?', data, (err, result)=> {
                if(err) return res.status(500).send(err);
                res.status(200).send(result);
                console.log('shared file in db!');
            })
        }
    })
});
// Get all shared files
router.get('/getshared/:userId', (req, res)=> {
    con.query('SELECT f.*, u.firstname, u.lastname FROM `files` f LEFT JOIN `shared` s ON ? IN (shared_user) LEFT JOIN `users` u ON s.user_file = u.id  WHERE f.file_id = s.shared_file', req.params.userId, (err, data)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(data)
    })
});

module.exports = router;