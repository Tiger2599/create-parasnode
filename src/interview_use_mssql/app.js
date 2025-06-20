require("dotenv").config();
require('./connection')

const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const cors = require('cors');

const corsOptions = {
	origin: "*", 
	methods: ['GET', 'POST'], 
	allowedHeaders: ['Content-Type', 'Authorization'],  
};
app.use(cors(corsOptions));
// app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json({ limit: '1000kb' }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: 'strict' }
}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use("/assets",express.static("./views/assets"));

app.use("/", require("./Router/router"));

app.use('*',(req, res, next) => {
    res.status(404).send('Page Not Found');
});

require('http')
.createServer(app)
.listen(port,(err)=>{
	if(err){
		console.log(err);
	}
	console.log(`server is running on http://localhost:${port}`);
})