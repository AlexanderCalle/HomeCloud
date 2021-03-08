// Packages
const express = require('express');
const router = express.Router();
const con = require('../connect');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http)

// Get a chat
router.get('/getChat/:userId/:friendId', (req, res)=> {

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
// make chat
router.post('/makechat', (req, res)=> {
    const data = {
        userOne: req.body.userOne,
        userTwo: req.body.userTwo
    }
    con.query('INSERT INTO chats SET ?', data, (err, result)=> {
        if (err) return res.status(500).send(err);
        res.status(200).send(result)
    });
});
// function getMessages(chatId){
// 	con.query('SELECT * FROM messages WHERE chatId = ?', chatId, (err, result)=> {
//         if(err) console.log(err);
// 		return result;
// 	});
// }

// array of all users
let users = [];
// If user joins a room
function userJoin(id, userId){
    const user = {id , userId}
    users.push(user);
    return users;
}
// get all users in socket
function getUser(userId) {
    return users.find(user => user.userId == userId);
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
// Send message to chat
router.post('/sendmessage', (req, res)=> {
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
// Get all messages from chat
router.get('/getMessages/:chatId', async (req, res) => {
    const chatId = req.params.chatId

    con.query('SELECT * FROM messages WHERE chatId = ?', chatId, (err, result)=> {
        if(err) console.log(err);
		res.status(200).send(result);
	});

});
// Get latets messages from all chats
router.get('/getlatestmessages/:userId', (req, res)=> {

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
// Update of user sees message
router.post('/seenmessages/:chatId/:userId', (req, res) => {
	con.query('UPDATE messages SET Status = 1 WHERE chatId = ? AND toUser = ?', [req.params.chatId, req.params.userId], (err, result)=> {
        if(err) console.log(err);
		res.status(200).send(result);
	})
});


module.exports = router;