const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));
require('./io')(server);

app.get('/', (req, res) => res.render('home'));
app.get('/:room', (req, res) => res.render('chat', { room: req.params.room }));

const PORT = process.env.PORT || 8000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));