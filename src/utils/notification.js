const axios = require("axios")

exports.send = (body) =>{
    axios.post("http://localhost:4000/send",body);
}