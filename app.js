const express = require("express");
const helmet = require("helmet");
const app = express(); // create an instance of express
const Knex = require("knex"); // SQL query builder
const cors = require('cors');
/* var PORT = 4000; */
/* var http = require("http");
var https = require("https"); */

/* app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
}); */
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
// const connect = () => {
//   return Knex({
//     client: "pg",
//     connection: {
//       host: "trabalho-pbd.postgres.database.azure.com",
//       port: 5432,
//       user: "BiancaBeppler",
//       password: "Tr@balhoPBD",
//       database: "postgres",
//     },
//   });
// };
exports.knex = connect();

const indexRoute = require("./src/routes/index-route");

app.use("/", indexRoute);

module.exports = app;
/* var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
 */
