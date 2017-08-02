var mainRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var DB = "mongodb://localhost/interview";
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
var morgan = require('morgan');
var app = express();
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/', mainRouter);
app.use('/api', apiRouter);

mongoose.Promise = global.Promise;

mongoose.connect(DB, function(err) {
    if (err) {
        return err;
    } else {
        console.log('Successfully connected to ' + DB);
    }
});
app.use(express.static('./static'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/static/app/views/index.html');
});

app.listen(config.port, function() {
    console.log('Listening on port ' + config.port);
});
