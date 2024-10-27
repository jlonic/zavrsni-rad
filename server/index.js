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
const favoriteRoutes = require("./routes/favoriteRoutes");
const admin = require("./routes/adminRoute");
const login = require("./routes/login");

const multer = require("multer");
const path = require("path");


//app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); //folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); //unique file names
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const filePath = '/uploads/' + req.file.filename;
    res.json({ filePath });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
app.use("/favorites", favoriteRoutes);
app.use("/admin", admin);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type", "multipart/form-data"],
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