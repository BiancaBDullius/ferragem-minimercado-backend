const express = require("express");
const helmet = require("helmet");
const app = express(); // create an instance of express
const Knex = require("knex"); // SQL query builder
const cors = require('cors');

app.use(cors({
  methods: ['GET','PATCH'],
  origin: '*'
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));




const connect = () => {
    return Knex({
      client: 'pg',
      connection: "postgres://BiancaBeppler:Tr@balhoPBD@trabalho-pbd.postgres.database.azure.com/postgres?sslmode=require",
      searchPath: ['knex', 'public'],
    });
  };

exports.knex = connect();

const indexRoute = require("./src/routes/index-route");

app.use("/", indexRoute);

module.exports = app;

