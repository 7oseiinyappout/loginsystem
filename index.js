const express = require('express');
const cors = require("cors");
const router = require('./src/routes/appRouter');
const {connectDB} = require('./src/configs/mongoDB');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

connectDB()
// awsS3()
app.all("/",(req,res,err) => {res.send("wellcode to out app")});
app.use("/api",router)
app.all("*",(req,res,err) => {res.send("route not found")});

app.listen(3000,() => {console.log("listening")});