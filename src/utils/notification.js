const axios = require("axios")

exports.send = (body) =>{
    axios.post("http://192.168.1.12:4000/send",body);
}