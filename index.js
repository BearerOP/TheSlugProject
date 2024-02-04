const cookiparser = require("cookie-parser");
const express = require("express");
let dotenv = require("dotenv");
let path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiparser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

let { connectDB } = require("./db/dbconnection.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define a route for the root URL ("/")
app.use("/", require("./src/routes/url_routes"));
app.use("/", require("./src/routes/user_validation_routes.js"));
app.use("/", require("./src/routes/insta_routes.js"));

app.use("/public", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "src/views"));

app.set("view engine", "ejs");

// Start the Express server
connectDB();
app.listen(process.env.port, () => {
  console.log(`app listening on http://localhost:${process.env.port}/`);
});
