// modules =================================================
var express = require('express');
var app = express();
app.set('trust proxy', true);
const logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require("./server/routes");
var cors = require('cors');
const path = require("path");
const config = require("./server/environments");
var http = require('http').createServer(app);
const io = require('socket.io')(http);
var useragent = require('express-useragent');

// configuration ===========================================
var port = config.PORT || 8080; // set our port

app.use(bodyParser.json({ limit: '50mb' }));
app.use(useragent.express());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(cors());
app.use(logger('dev'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    next();
});

app.get('/', function (req, res) {
    res.send('Welcome to Aerostar');
});

app.use("/api", indexRouter);

app.use(express.static(path.join(__dirname, "../build")));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

io.sockets.on("connection", function (socket) {
    // Everytime a client logs in, display a connected message
    console.log("Server-Client Connected!");
    socket.join("_room" + socket.handshake.query.report_document_id);
    socket.on('connected', function (data) {

    });
    socket.on('qr_code_scan', function (report_document_id) {
        io.sockets.in("_room" + report_document_id).emit("qr_code_scan", true);
    });
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;

http.listen(port, () => {
    console.log('Magic happens on port ' + port); // shoutout to the user
});

exports = module.exports = app;
