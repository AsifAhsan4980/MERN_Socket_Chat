require('dotenv').config({path: "./config.env"})
const express = require('express')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cors = require("cors");
const http = require('http')
const chat = require('./controllers/chat')

const socket = require('socket.io')
connectDB().then(r => console.log("MongoDB Connected"));


const app = express()
const devServer = http.createServer(app)
const io = socket(devServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use("/api/private", require("./routes/private"));
app.use("/api/user", require("./routes/user"));
app.use("/api/user/chat", require("./routes/chat"));
app.use("/api/user/messages", require("./routes/message"));



chat(io)

// io.on('connection', (socket) => {
//     console.log('new user connected')
//     io.emit('message', 'welcome to chat')
//
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server = devServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)

    }
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
});