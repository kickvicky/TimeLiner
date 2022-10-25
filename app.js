const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const { ObjectID, Binary } = require('bson');
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb+srv://kickvicky:Test123@cluster0.x5ccgfy.mongodb.net/?retryWrites=true&w=majority/data')

const timeSchema = new mongoose.Schema({
    subjectName: String,
    place: String,
    ImageId: String
})

const fileSchema = new mongoose.Schema({
    fileId: String,
    chunkSize: Number,
    length: Number,
    uploadDate: Date
})

const chunckSchema = new mongoose.Schema({
    files_id: ObjectID,
    n: Number,
    data: Buffer
})

const TimeData = new mongoose.model("timeData", timeSchema);
const filesImg = new mongoose.model("fs.file", fileSchema);
const chunckImg = new mongoose.model("fs.chunk", chunckSchema);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
})

app.post("/", function (req, res) {
    var testName = req.body.inputName
    // var img = req.body.suspectImg
    TimeData.find({ subjectName: testName }, function (err, logs) {
        if (!err) {
            var imageID = logs[0].ImageId
            var myObjectIdString = imageID.toString();
            console.log(myObjectIdString)
            filesImg.find({ fileId: myObjectIdString }, function (er, l) {
                // fileId: myObjectIdString
                var objID = l[0]._id
                var myFileIdString = objID.toString();
                console.log(myFileIdString)
                chunckImg.find({ files_id: myFileIdString }, function (e, r) {
                    var imgData = r[0].data
                    res.render("timeline", { logData: logs, subjectImg: imgData })
                })
                // console.log(l);
            })
        }
        else {
            console.log("Error :)");
        }
    })
})

app.listen(3000, function () {
    console.log("Hello !!!");
})



