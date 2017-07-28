/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config.js');
const mongoose = require('mongoose');
const apiRouter = require('./app/routes/api');
var DB = "mongodb://localhost/interview";

mongoose.createConnection(DB, (err) => {
	if(err){
		console.log(err);
	}
});
mongoose.Promise = global.Promise;

const app = express();
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/static/app/views/index.html');
});

app.listen(config.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('server started at ' + config.port);
    }
});
