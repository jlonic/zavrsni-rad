const express = require("express");
const app = express();
const cors = require("cors");
const artistRoutes = require("./routes/artistRoutes");
const userRoutes = require("./routes/userRoutes");
const albumRoutes = require("./routes/albumRoutes");
const trackRoutes = require("./routes/trackRoutes");
const followRoutes = require("./routes/followRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const login = require("./routes/login");

app.use(cors());
app.use(express.json());

//routes
app.use("/artists", artistRoutes);
app.use("/users", userRoutes);
app.use("/albums", albumRoutes);
app.use("/tracks", trackRoutes);
app.use("/login", login);
app.use("/follows", followRoutes);
app.use("/messages", messageRoutes);
app.use("/reviews", reviewRoutes);


app.listen(5000, () => {
    console.log("server started")
}); //node index.js to start server, npm start to start react app