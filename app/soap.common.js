const axios = require("axios");

module.exports = axios.create({
  baseURL: `http://localhost:${process.env.SOAP_PORT}`,
  headers: { "content-type" : "text/xml"},
});