require("dotenv").config();
require('./connection')

const express = require('express');
const app = express();
const port = 1105;
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const cors = require('cors');
const { whiteList } = require('./Config/whitelistIp');

const corsOptions = {
	origin: whiteList, 
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
app.use("/admin/assets",express.static("./views/admin/assets"))
app.use("/flag", express.static("./flag"));

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