// Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const con = require('./connect');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http)
const morgan = require('morgan');

// Port
const port = process.env.PORT || 3030;

// Middleware
app.use(morgan('tiny'));
app.use(cors({
    origin:'*',
    credentials: true
}));
app.use(express.static('./upload'))
dotenv.config();
app.use(bodyParser.json({limit: 128*1024*1024}));
app.use(bodyParser.urlencoded({limit: 128*1024*1024, extended: true}));

// Get all files of users path
const getAllFiles = function(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)
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
    });
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

// array of chunks to be uploaded

//5368709120 == 5 GB
//52428800 == 50 MB

// Get the total size of users folder
app.get('/directorySize/:userId', (req, res) => {
    res.status(200).send({
        totalSize: getTotalSize('./upload/' + req.params.userId),
        totalSizeBytes: Math.ceil((getTotalSizeBytes('./upload/' + req.params.userId) / 5368709120) * 100),
        total: getTotalSizeBytes('./upload/' + req.params.userId)
    });
})

// Login method:Post
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

// Register method:Post
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

//socket middelware
// array of all users
let usersChats = [];
// If user joins a room
function userJoin(id, userId){
    const user = {id , userId}
    usersChats.push(user);
    return usersChats;
}
// get all users in socket
function getUser(userId) {
    return usersChats.find(user => user.userId == userId);
  }
// Create socket
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

//Router folders
const folders = require('./router/folders');
app.use('/folders', folders);

// Router files
const files = require('./router/files');
app.use('/files', files);

// Router myprofile
const myprofile = require('./router/myprofile');
app.use('/myprofile', myprofile);

// Router users
const users = require('./router/users');
app.use('/users', users);

// Router chat
const chat = require('./router/chat');
app.use('/chat', chat);

// Router Search
const search = require('./router/search');
app.use('/search', search);

// Router forgot
const forgot = require('./router/forgot');
app.use('/forgot', forgot);

// Opens server on port 3030
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})