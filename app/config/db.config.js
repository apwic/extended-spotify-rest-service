module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  port: process.env.DB_PORT,
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