const http = require('http');

const port = process.env.PORT || 8000;

const express = require('express');
const app = express();

const server = http.createServer(app);

server.listen(port, () => {
	console.log(`Server is running on port:${port}`);
});

// shorthand version of passing it into server
// same as http.createServer(app).listen
// app.listen(port, () => {
// 	console.log(`Server is running on port:${port}`);
// });
