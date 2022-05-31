const express = require('express')
const bodyParser = require('body-parser')
const app = express()

require("dotenv").config();

const mongoose = require('mongoose');

const { auth, requiresAuth } = require('express-openid-connect');

const port = process.env.PORT || "3000";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

main().catch(err => console.log(err));

async function main() {
    mongoose.connect("mongodb://localhost:27017/madersa", {
        useNewUrlParser: "true",
        useUnifiedTopology: "true"
    })
}

const coverageSchema = new mongoose.Schema({
    name: String,
    chapterNum: Number,
    chapterName: String,
    notes: String
});

const classSchema = new mongoose.Schema({
    teachers: [String],
    startTime: String,
    endTime: String,
    coverage: {
        type: coverageSchema,
        required: true
    }
});

const studentSchema = new mongoose.Schema({
    name: String,
    attendance: String,
    late: Number,
    homework: Boolean,
    verses: Number
});

const markSchema = new mongoose.Schema({
    name: String,
    mark: Number
});

const assessmentSchema = new mongoose.Schema({
    subject: String,
    chapterNum: Number,
    chapterName: String,
    marks: {
        type: [markSchema],
        required: true
    }
});

const madersaSchema = new mongoose.Schema({
    name: String,
    date: {
        type: Date, 
        default: Date.now
    },
    class: {
        type: classSchema,
        required: true
    },
    student: {
        type: [studentSchema],
        required: true
    },
    assessment: {
        type: assessmentSchema,
        required: false
    }
});

const studentTableSchema = new mongoose.Schema({
    name: String,
    class: String,
    status: {type: Boolean, default: true}
});

const record = mongoose.model("Record", madersaSchema);

const student = mongoose.model("Student", studentTableSchema);


// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? res.redirect("/api/student_data") : res.redirect("/login"))
});


// to get all records present in record model containing everyday data of classes
app.get("/api/get_record", requiresAuth(), (req, res) => {
    record.find(function (err, found_data) {
        if (err) {
            res.json({status: 500, message: "Unable to retrieve"});
            throw err;
        } else {
            res.json({status: 200, message: "Retreive successfully", result: found_data});
        }
    });
});


// to get record of the classes held on the specific date
app.get("/api/get_record_by_date/:date", (req, res) => {
    record.find({date: req.params.date}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retrieve"});
            throw err;
        } else {
            res.json({status: 200, message: "Retreive successfully", result: found});
        }
    });
});


// to get record of the specific class held till now
app.get("/api/get_record_by_name/:name", (req, res) => {
    record.find({name: req.params.name}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retrieve"});
            throw err;
        } else {
            res.json({status: 200, message: "Retreive successfully", result: found});
        }
    });
});


// to get record of the specific class held on the specific date
app.get("/api/get_record_by_both/:date/:name", (req, res) => {
    record.find({date: req.params.date, name: req.params.name}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retrieve"});
            throw err;
        } else {
            res.json({status: 200, message: "Retreive successfully", result: found});
        }
    });
});


// add new records i.e. everyday data into the record model
app.post("/api/new_record_data", function(req, res) {
    const s = new record(req.body);
    s.save((err, result) => {
        if (err) {
            res.json({status: 500, message: "Unable to upload"});
            throw err;
        } else {
            res.json({status: 200, message: "Upload successfully"});
        }
    });
});


// get all students from student model
app.get("/api/get_student", (req, res) => {
    student.find(function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});


// get students by name (can be multiple)
app.get("/api/get_student_by_name/:name", (req, res) => {
    student.find({name: req.params.name}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
            throw err;
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});


// get students by class
app.get("/api/get_student_by_class/:class", (req, res) => {
    student.find({class: req.params.class}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
            throw err;
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});


// get students by class and name (should be one)
app.get("/api/get_student_by_both/:class/:name", (req, res) => {
    student.findOne({class: req.params.class, name: req.params.name}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
            throw err;
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});


// add new student's data into student model
app.post('/api/new_student_data', (req, res) => {
    const s = new student(req.body);
    s.save((err, result) => {
        if (err) {
            res.json({status: 500, message: "Unable to upload"});
            throw err;
        } else {
            res.json({status: 200, message: "Upload successfully"});
        }
    });
});


// updating student's class (not promoting)
app.put('/api/update_student_class/:name/:class', (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {class: req.body.class}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully updated", result: result});
        } else {
            res.json({status: 500, message: "Unable to update"});
        }
    });
    
});


// updating student's name
app.put('/api/update_student_name/:name/:class', (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {name: req.body.name}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully updated", result: result});
        } else {
            res.json({status: 500, message: "Unable to update"});
        }
    });
});


// to delete a student (actually changes the status to false rather than deleting it permanently)
app.put('/api/delete_student/:name/:class', (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {status: false}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully deleted", result: result});
        } else {
            res.json({status: 500, message: "Unable to delete"});
        }
    });
});


// to revive a student (actually changes the status to true rather than adding it again)
app.put('/api/revive_student/:name/:class', (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {status: true}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully revived", result: result});
        } else {
            res.json({status: 500, message: "Unable to revive"});
        }
    });
});


// get all assessments from records model
app.get("/api/get_assessments", (req, res) => {
    record.find({}, 'assessment', function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});



// get all assessments from records model of specific student
app.get("/api/get_assessments_by_student/:name/:class", (req, res) => {
    record.find({'name': req.params.class}, {'assessment.marks': 1}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
        } else {
            for (i=0; i<found.length; i++) {
                console.log(found[i].assessment);
            }
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});

// incase of route not present in the file
app.get('*', function(req, res){
    res.json({status: 400, message: "Bad request"});
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port ${port}`)
    }
});