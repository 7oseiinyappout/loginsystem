const axios = require("axios")

exports.send = (body,req) =>{
    const protocol = req.protocol; // http or https
    const host = req.get('host'); 
    axios.post(`${protocol}://${host}/sendnotification`,body).catch((e)=>{
        console.log("error in sending notification" + e)
    })
}