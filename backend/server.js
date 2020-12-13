const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3030;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    console.log(req.body);
    if(req.body.email != "" && req.body.password != "") {
        console.log('succes');
        return res.status(200).send({
            email: email
        })
    } else {
        return res.status(403).send("Not everything is filled in!")
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})