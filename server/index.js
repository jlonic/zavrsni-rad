const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

//import routes
const artistRoutes = require("./routes/artistRoutes");
const userRoutes = require("./routes/userRoutes");
const albumRoutes = require("./routes/albumRoutes");
const trackRoutes = require("./routes/trackRoutes");
const followRoutes = require("./routes/followRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reportRoutes = require("./routes/reportsRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const billboardChartsRoutes = require("./routes/billboardChartsRoutes");

const login = require("./routes/login");

//app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
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
app.use("/reports", reportRoutes);
app.use("/notifications", notificationRoutes);
app.use("/search", searchRoutes);
app.use("/charts", billboardChartsRoutes);


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    //console.log("New client connected");
    socket.on("sendMessage", (data) => {
        io.emit("newMessage", data);
    });
});


server.listen(5000, () => {
    console.log("server started ")
}); 