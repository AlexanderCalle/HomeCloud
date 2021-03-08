const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const con = require('./connect');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http)
const morgan = require('morgan');
const sgMail = require('@sendgrid/mail');

const port = process.env.PORT || 3030;
app.use(morgan('tiny'))
app.use(cors({
    origin:'*',
    credentials: true
}));
app.use(express.static('./upload'))
dotenv.config();
app.use(bodyParser.json({limit: 128*1024*1024}));
app.use(bodyParser.urlencoded({limit: 128*1024*1024, extended: true}));

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(__dirname, dirPath, file))
      }
    })
  
    return arrayOfFiles
  }

const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes == 0) {
        return "n/a"
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    if (i == 0) {
        return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}

const getTotalSize = function(directoryPath) {
    const arrayOfFiles = getAllFiles(directoryPath)

    let totalSize = 0
  
    arrayOfFiles.forEach(function(filePath) {
      totalSize += fs.statSync(filePath).size
    })
  
    return convertBytes(totalSize)
  }
const getTotalSizeBytes = function(directoryPath) {
    const arrayOfFiles = getAllFiles(directoryPath)

    let totalSize = 0
  
    arrayOfFiles.forEach(function(filePath) {
      totalSize += fs.statSync(filePath).size
    })
  
    return totalSize
  }

let chunks = [];

app.get('/', (req, res) => {
    res.send('hello')
});

//5368709120 == 5 GB
//52428800 == 50 MB

app.get('/directorySize/:userId', (req, res) => {
    res.status(200).send({
        totalSize: getTotalSize('./upload/' + req.params.userId),
        totalSizeBytes: Math.ceil((getTotalSizeBytes('./upload/' + req.params.userId) / 5368709120) * 100),
        total: getTotalSizeBytes('./upload/' + req.params.userId)
    });
})

app.post('/login', (req, res) => {
    console.log('logging in');
    const email = req.body.email;
    if(req.body.email != "" && req.body.password != "") {
        con.query('SELECT * FROM users WHERE email = ?', req.body.email, (err, result)=> {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if(result[0] === undefined) {
                return res.status(403).send('email');
            }
            if(bcrypt.compareSync(req.body.password, result[0].password_hash)) {
                res.status(200).send({
                    email: email,
                    id: result[0].id,
                    profile_pic: result[0].profile_pic,
                    name: result[0].firstname + ' ' + result[0].lastname,
                });
            } else {
                console.log('password');
                return res.status(403).send("password");
            }
        });
    } else {
        return res.status(403).send("fields")
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
                fs.mkdirSync('./upload/' + generated_id + '/');
                const data = {
                    id: generated_id,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password_hash: password_hash,
                    folder_path: '/' + generated_id + '/'
                }
                con.query('INSERT INTO `users` SET ?', data, (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.sendStatus(500)
                    }
                    return res.status(200).send({
                        email: data.email,
                        id: data.id,
                        profile_pic: null,
                        name: req.body.firstname + ' ' + req.body.lastname,
                    })
                });
            }
            
        });
    } else {
        return res.status(403).send('')
    }
});

app.get('/folders/:id', (req, res)=> {
    con.query('SELECT * FROM `folders` WHERE user_id = ?', req.params.id, (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});

app.post('/addfolder/:id', (req, res)=>{
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

app.get('/folders/folder/:folder_id', (req, res) => {
    con.query('SELECT * FROM `files` WHERE folder_id = ?', req.params.folder_id, (err, files) => {
        if (err) return res.status(500).send(err);
        if(files[0] === undefined) return res.send("no data");
        res.send(files);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './upload/profilePic/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${req.params.userId + '.' + file.originalname.split('.')[1]}`)
    }
  })

let upload = multer({ storage: storage})

let ws = null;

function writeStream(path) {
    console.log(path);
    ws = fs.createWriteStream(path)
}

app.post('/addfiles/:user_id/:foldername/:filename', (req, res) => {
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

app.get('/myprofile/:userid', (req, res)=>{
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

app.post('/renamefolder/:folderId', (req, res)=>{
    
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

app.post('/renamefile/:folderId/:fileId', (req, res) => {
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

app.get('/deletefile/:fileId', (req, res) => {

    con.query('SELECT * FROM `files` WHERE file_id = ?', req.params.fileId, (err, files) => {
        if (err) return res.status(500).send(err);

        fs.unlinkSync('./upload' + files[0].path);
        con.query('DELETE FROM `files` WHERE file_id = ?', req.params.fileId, (err, result)=> {
            if (err) return res.status(500).send(err);
            res.status(200).send('ok')
        });

    });

});

app.get('/deletefolder/:folderId', (req, res)=> {

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

app.get('/getfolder/:userId/:foldername', (req, res)=> {

    const file = new AdmZip();

    file.addLocalFolder('./upload/' +req.params.userId + '/' + req.params.foldername);

    file.writeZip('./upload/zipFiles/' + req.params.foldername + '.zip');

    res.download(`./upload/zipFiles/${req.params.foldername}.zip`);

});

app.post('/UploadChunks', (req, res) => {

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

app.get('/openStream/:userId/:foldername/:filename', async (req, res) => {

    let path = `./upload/${req.params.userId}/${req.params.foldername}/${req.params.filename}`;

    await writeStream(path);

    res.status(200).send('ok');

});

app.post('/updateuser/:userId', async (req, res) => {
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

app.post('/uploadPic/:userId', upload.single('file'), (req, res) => {

    const path = `/profilePic/${req.params.userId + '.' + req.file.originalname.split('.')[1]}`

    con.query('UPDATE `users` SET profile_pic = ? WHERE id = ?', [path, req.params.userId], (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send({
            profile_pic: path
        })
    })
});


app.get('/users/search/:userId/:query', async (req, res) => {  
    const userId  = req.params.userId;
    const query = `SELECT u.id, u.firstname, u.lastname, u.email, u.profile_pic, b.Status FROM users u LEFT JOIN friends b ON u.id IN (b.UserOne, b.UserTwo) AND ? IN (b.UserOne, b.UserTwo) WHERE CONCAT ( u.firstname, ' ', u.lastname ) LIKE ? AND u.id <> ?`

    con.query(query, [userId, req.params.query + '%', userId], async (err, result) => {
        if(err) console.log(err);

        res.status(200).send(result);
    })
});

app.get('/users/friends/:userId', (req, res)=> {

    const userId = req.params.userId;

    con.query(`SELECT * FROM friends AS F , users AS U WHERE CASE WHEN F.UserOne = ? THEN F.UserTwo = U.id WHEN
    F.UserTwo = ? THEN F.UserOne = U.id END AND F.Status = 1`, [userId, userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        if(result.length != 0) {
            res.status(200).send(result);
        }
    })
});

app.post('/users/addFriend', (req, res) => {

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

app.get('/users/friendrequests/:userId', (req, res)=> {
    const userId = req.params.userId;

    con.query(`SELECT * FROM friends AS F , users AS U WHERE CASE WHEN F.UserTwo = ? THEN F.UserOne = U.id END AND F.Status = 0`, [userId, userId], (err, result) => {
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});

app.post('/users/updateRequest/:FriendsId', (req, res)=> {
    con.query('UPDATE `friends` SET `Status` = ? WHERE FriendsId = ?', [req.body.Status, req.params.FriendsId], (err, result)=>{
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

app.get('/users/deleteFriend/:FriendsId/:userId', (req, res)=> {
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

app.get('/chat/getChat/:userId/:friendId', (req, res)=> {

    const userId = req.params.userId;
    const friendId = req.params.friendId;

    con.query('SELECT * FROM chats WHERE ? IN (userOne, userTwo) AND ? IN (userOne, userTwo)', [userId, friendId], (err, result)=> {
        if (err) console.log(err);
        
        if(result[0] === undefined) {
            res.status(201).send('No chat');
        } else {
            res.status(200).send(result[0])
        }

    });

});

app.post('/chat/makechat', (req, res)=> {
    const data = {
        userOne: req.body.userOne,
        userTwo: req.body.userTwo
    }

    con.query('INSERT INTO chats SET ?', data, (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send(result)
    });
});

function getMessages(chatId){
	con.query('SELECT * FROM messages WHERE chatId = ?', chatId, (err, result)=> {
        if(err) console.log(err);
		return result;
	});
}

let users = [];

function userJoin(id, userId){
    const user = {id , userId}
    users.push(user);
    return users;
}

function getUser(userId) {
    return users.find(user => user.userId == userId);
  }

io.on("connection", socket => {  
    socket.emit('connection', null);

	socket.on('joinchat', ({chatId, userId}) => {
        socket.join(chatId);
        userJoin(socket.id, userId);
    });
    
    socket.on('sendMessage', ({data, chatId}) => {    
        io.sockets.to(chatId).emit('message', data);
        io.sockets.to(chatId).emit('latest', data);
    });

    socket.on('sendMelding', ({userId, friendId}) => {           
        const user = getUser(friendId);
        const currentUser = getUser(userId);
        if(user != undefined) {
            io.to(user.id).emit('latest');

            if(currentUser != undefined) {
                io.to(currentUser.id).emit('latest');
            }
        }
    })
});

app.post('/chat/sendmessage', (req, res)=> {
	const data = {
        chatId: req.body.chatId,
		fromUser: req.body.fromUser,
		toUser: req.body.toUser,
		message: req.body.message,
		Status: 0
	}

	con.query('INSERT INTO messages SET ?', data, (err, result) => {
		if(err) console.log(err);
        res.status(200).send('result');
        //io.sockets.in(data.chatId).emit("message", data);
	});
});

app.get('/chat/getMessages/:chatId', async (req, res) => {
    const chatId = req.params.chatId

    con.query('SELECT * FROM messages WHERE chatId = ?', chatId, (err, result)=> {
        if(err) console.log(err);
		res.status(200).send(result);
	});

});

app.get('/chat/getlatestmessages/:userId', (req, res)=> {

    let query = `
        select c.maxID as chatId , d.* , c.chatId
        from messages d 
        inner join (
            select max(b.message_id) as maxID, b.chatId  
            from chats a 
            inner join messages b 
            on a.chatId = b.chatId 
            where ? in (a.userOne, a.userTwo)
            group by b.chatId) c 
        on c.maxID = d.message_id
    `

	con.query(query , req.params.userId, (err, result) => {
		if(err) console.log(err);

		res.status(200).send(result);		

	})
});

app.post('/chats/seenmessages/:chatId/:userId', (req, res) => {
	con.query('UPDATE messages SET Status = 1 WHERE chatId = ? AND toUser = ?', [req.params.chatId, req.params.userId], (err, result)=> {
        if(err) console.log(err);
		res.status(200).send(result);
	})
});

app.get('/friends/search/:userId/:query', (req, res) => {
    const query = `SELECT u.id, u.firstname, u.lastname, u.email, u.profile_pic FROM users u LEFT JOIN friends b ON u.id IN (b.UserOne, b.UserTwo) AND ? IN (b.UserOne, b.UserTwo) WHERE CONCAT ( u.firstname, ' ', u.lastname ) LIKE ? AND u.id <> ? AND b.Status = "1"`

    con.query(query, [req.params.userId, req.params.query + '%', req.params.userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(result)
    })
});

app.post('/files/sharefile', (req, res)=> {
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

app.get('/files/getshared/:userId', (req, res)=> {
    con.query('SELECT f.*, u.firstname, u.lastname FROM `files` f LEFT JOIN `shared` s ON ? IN (shared_user) LEFT JOIN `users` u ON s.user_file = u.id  WHERE f.file_id = s.shared_file', req.params.userId, (err, data)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(data)
    })
});

app.get('/users/allfriends/:userId', (req, res)=> {
    con.query('SELECT u.firstname, u.lastname, u.profile_pic, f.created, u.id FROM `friends` f LEFT JOIN `users` u on ? in (f.UserOne, f.UserTwo) AND Status = 1 AND U.id <> ? WHERE u.id = f.UserTwo OR u.id = f.UserOne', [req.params.userId, req.params.userId], (err, result)=> {
        if(err) return res.status(500).send(err);
        res.status(200).send(result);
    })
});

app.get('/search/find/file/folders/:userId/:query', (req, res)=> {
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

app.post('/forgot/sendemail/:email', (req, res) => {

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

app.post('/forgot/checkcode/:email/:code', (req, res) => {
    var date = new Date().toJSON().slice(0, 19)
    con.query('SELECT * FROM users WHERE resetPasswordCode = ? AND resetPasswordExpired > ?', [req.params.code, date], (err, user)=> {
        if (err) return res.status(500).send(err);
        if(!user[0]) return res.status(404).send("No token or expired");
        res.status(200).send('ok');
    });
})

app.get('/forgot/code/:email/:code', (req, res) => {
    var date = new Date().toJSON().slice(0, 19)
    con.query('SELECT * FROM users WHERE resetPasswordCode = ? AND resetPasswordExpired > ?', [req.params.code, date], (err, user)=> {
        if (err) return res.status(500).send(err);
        if(!user[0]) return res.status(404).send("No token or expired");
        res.status(200).send('ok');
    });
});

app.post('/forgot/newpassword/:email/:code', (req, res) => {
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

http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})