// Packages
const express = require('express');
const router = express.Router();
const con = require('./../connect');
const fs = require('fs');
const AdmZip = require('adm-zip');

// Router folders
// Get all folders
router.get('/:id', (req, res)=> {
    con.query('SELECT * FROM `folders` WHERE user_id = ?', req.params.id, (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});
// Add folder method:Post
router.post('/addfolder/:id', (req, res)=>{
    const path = './upload/' + req.params.id + '/' + req.body.name + '/'
    if(req.body.name != "" && !fs.existsSync(path)){
        const data = {
            name: req.body.name,
            main_path: '/' + req.params.id + '/',
            user_id: req.params.id
        }
        con.query('INSERT INTO `folders` SET ?', data, (err, result)=> {
            if (err) {
                res.status(500).send(err);
                console.log(err)
            } 
            fs.mkdirSync('./upload/' + req.params.id + '/' + req.body.name.toLowerCase() + '/')
            res.status(200).send({
                name: req.body.name,
            });
        })
    } else {
        if(req.body.name != ""){
            res.sendStatus(400);
        } else {
            res.sendStatus(402);
        }
    }
});
// Get all files from inside folder
router.get('/folder/:folder_id', (req, res) => {
    con.query('SELECT * FROM `files` WHERE folder_id = ?', req.params.folder_id, (err, files) => {
        if (err) return res.status(500).send(err);
        if(files[0] === undefined) return res.send("no data");
        res.send(files);
    });
});
// Rename a folder method:Post
router.post('/renamefolder/:folderId', (req, res)=>{
    
    con.query('SELECT * FROM `folders` WHERE folder_id = ?', req.params.folderId, (err, folder)=> {
        if (err) return res.status(500).send(err);

        const oldPath = './upload' + folder[0].main_path + folder[0].name;
        const newPath = './upload' + folder[0].main_path + req.body.name;

        fs.renameSync(oldPath, newPath);
        con.query('SELECT * FROM `files` WHERE folder_id = ?', req.params.folderId, (err, files)=> {
            if (err) return res.status(500).send(err);
            files.forEach(file => {
                const newFileDest = '/' + folder[0].user_id + '/' + req.body.name + '/' + file.name;
                con.query('UPDATE `files` SET path = ? WHERE file_id = ?', [newFileDest, file.file_id], (err, result)=> {
                    if (err) return res.status(500).send(err);
                });
            })
        });

        con.query('UPDATE `folders` SET name = ? WHERE folder_id = ?', [req.body.name, req.params.folderId], (err, result)=> {
            if (err) return res.status(500).send(err);
            res.status(200).send({
                name: req.body.name
            });
        }); 

    });

});
// Delete folder
router.get('/deletefolder/:folderId', (req, res)=> {

    con.query('SELECT * FROM `folders` WHERE folder_id = ?', req.params.folderId, (err, folder)=> {
        if (err) return res.status(500).send(err);

        con.query('SELECT * FROM `files` WHERE folder_id = ?', req.params.folderId, (err, files)=> {
            if (err) return res.status(500).send(err);

            files.forEach(file => {
                fs.unlinkSync('./upload' + file.path);

                con.query('DELETE FROM `files` WHERE file_id = ?', file.file_id, (err, result)=> {
                    if (err) return res.status(500).send(err);
                });
            });

            fs.rmdirSync('./upload' + folder[0].main_path + folder[0].name);
            con.query('DELETE FROM `folders` WHERE folder_id = ?', req.params.folderId, (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(200).send('Deleted successfully');
            });
        });


    });

});
// Get zipped folder downloaded
router.get('/getfolder/:userId/:foldername', (req, res)=> {

    const file = new AdmZip();

    file.addLocalFolder('./upload/' +req.params.userId + '/' + req.params.foldername);

    file.writeZip('./upload/zipFiles/' + req.params.foldername + '.zip');

    res.download(`./upload/zipFiles/${req.params.foldername}.zip`);

});


module.exports = router;