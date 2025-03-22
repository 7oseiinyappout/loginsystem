const express = require('express');
const router = require('./src/routes/appRouter');
const databases = require('./src/database/config');

const app = express();

app.use(express.json());
databases()
app.all("/",(req,res,err) => {res.send("wellcode to out app")});
app.use("/api",router)
app.all("*",(req,res,err) => {res.send("route not found")});

app.listen(3000,() => {console.log("listening")});