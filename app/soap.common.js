const axios = require("axios");

module.exports = axios.create({
  baseURL: `http://127.0.0.1:${process.env.SOAP_PORT}`,
  headers: { 
    "authorization" : process.env.API_KEY,
    "content-type" : "text/xml"
  },
});