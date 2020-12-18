const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use('/v1', require('./routes/api'));

app.get('/api', function(req, res) {
    //
});

app.listen(process.env.port || 1000, function(){
    console.log("Working");
});