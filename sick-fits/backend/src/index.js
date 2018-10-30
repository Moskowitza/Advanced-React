// let's go! start up Node server
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//User authentication

server.express.use(cookieParser());

//TODO use express middelware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running on http:/localhost:${deets.port}`);
  }
);
