module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD : "",
  DB : "sepotipayi_premium",
  dialect: "mysql",
  pool : {
    // max num of connection
    max: 5,
    // min num of connection
    min: 0,
    // max try connection in milisecond
    acquire: 30000,
    // max idle time in milisecond
    idle: 10000
  }
}