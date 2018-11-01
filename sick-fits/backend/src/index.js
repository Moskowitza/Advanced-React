// let's go! start up Node server
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//User authentication

server.express.use(cookieParser());

//TODO use express middelware to populate current user
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //put the userid into the req for future reqs to access
    req.userId = userId;
  }
  next();
});
// Create middleware that populates user on each request
server.express.use((req, res, next) => {
  if (!req.userId) return next();
});

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
