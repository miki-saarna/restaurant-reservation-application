const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

const app = express();

app.use(cors());

// CORS API access approval to requesting domain below
app.use(function(req, res, next) {
    // change the link of the 2nd argument to the location that the client is at
    res.header("Access-Control-Allow-Origin", "https://restaurant-reservation-application.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(express.json());

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
