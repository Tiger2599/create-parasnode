require("dotenv").config();

const express = require('express');
const path = require('path');
const port = process.env.PORT;
const cookie = require('cookie-parser');
const app = express();
const bodyparser = require("body-parser");

// const db = require('./config/mongodb');
const mongoose = require('mongoose')
const url = "mongodb+srv://parasbanbhiya:paras123@cluster0.znqpssm.mongodb.net/reqnt_app";
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

app.use(cookie());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets',express.static('./views/assets'))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/', require('./Router/router'));

app.listen(port, (err) => {
    if (err) {
        console.log("server not running ", err);
        return false;
    }
    console.log(`server is running on localhost:${port}`);
});