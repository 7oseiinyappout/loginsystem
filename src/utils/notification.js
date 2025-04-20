const axios = require("axios")

exports.send = (body,req) =>{
    const protocol = req.protocol; // http or https
    const host = req.get('host'); 
    axios.post(`https://loginsystem-production-9118.up.railway.app/sendnotification`,body).catch((e)=>{
        console.log("error in sending notification" + e)
    })
}