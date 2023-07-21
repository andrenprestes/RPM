const express = require("express");
const cors = require('cors');
const app = express();
const port = 8080;
const HOST = '0.0.0.0';

const index = require("./routers/index")

app.use(express.json())
app.use(cors())
app.use("/api", index);

app.listen(port, HOST);
console.log("server started on http://"+HOST+":"+port);