const express = require("express");
const { ExpressPeerServer } = require("peer");
const app = express();
const cors = require("cors");
// app.use(cors({
//     origin: ['http://192.168.1.2:5173/', 'https://www.google.com/','http://192.168.1.2:3000/']
// }))

// app.options('*', cors()) // include before other routes
app.use(
  cors({
    origin: "*",
  })
);

app.enable("trust proxy");

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

const peerServer = ExpressPeerServer(server, {
  path: "/",
});

app.use("/", peerServer);

module.exports = app;
