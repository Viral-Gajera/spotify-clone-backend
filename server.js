require("dotenv").config();
let cors = require("cors");
let express = require("express");
let router = require("./app/router/router");

let counter = 0;
let app = express();

app.use(cors());
app.use(express.json());
app.use("/", function (req, res, next) {
    console.log(`${counter++}. ${req.method} ${req.url}`);
    next();
});
app.use("/image", express.static("./app/model/images"));
app.use("/audio", express.static("./app/model/audios"));
app.use("/", router);

app.listen(8080, function () {
    console.log("App listening on port 8080...");
});
