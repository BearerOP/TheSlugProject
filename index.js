const cookiparser = require("cookie-parser");
const express = require("express");
let dotenv = require("dotenv");
let path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");
var cookieParser = require('cookie-parser')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiparser());

// app.use(
//   cors({
//     origin: "https://theslug.netlify.app","http://localhost:5173",
//     credentials: true,
//   })
// );

const corsOptions = {
  origin: ["https://theslug.netlify.app","http://localhost:5173"], // Allow requests from example1.com and example2.com
  methods: 'GET,POST', // Allow only GET and POST requests
    credentials: true,
  allowedHeaders: 'Content-Type,Authorization', // Allow only specific headers
};
// Handle CORS preflight requests
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

let { connectDB } = require("./db/dbconnection.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define a route for the root URL ("/")
app.use("/", require("./src/routes/url_routes"));
app.use("/", require("./src/routes/user_validation_routes.js"));
app.use("/", require("./src/routes/google_validation_routes.js"));
app.use("/", require("./src/routes/insta_routes.js"));
app.use("/", require("./src/routes/user_profile_routes.js"));

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
