const axios = require("axios");

module.exports = axios.create({
  baseURL: `http://host.docker.internal:${process.env.SOAP_PORT}`,
  headers: { 
    "authorization" : process.env.API_KEY,
    "content-type" : "text/xml"
  },
});