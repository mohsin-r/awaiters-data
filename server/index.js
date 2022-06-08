const log = console.log
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const sessions = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path');

require("dotenv").config();

const mongoose = require('mongoose');
mongoose.set('bufferCommands', false)

const port = process.env.PORT || 5000;

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

main().catch(err => console.log(err));

async function main() {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: "true",
        useUnifiedTopology: "true"
    })
}

const userSchema = new mongoose.Schema({
    username: String,
    title: String,
    password: String
})

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
        type: [coverageSchema],
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

const user = mongoose.model("User", userSchema)

const authenticate = async (req, res, next) => {
	// if (env !== 'production' && USE_TEST_USER)
	//     req.session.user = 'user';
	// console.log(req.session.user)

	if (req.session.user) {
		try {
			const userFound = await user.findOne({ 'username': req.session.user });
			if (!user) {
				return Promise.reject();
			}
			req.user = userFound;
			next();
			return;
		} catch (error) {
			res.status(401).send("Unauthorized");
			return;
		}
	}
	res.status(401).send("Unauthorized");
}

/*** Session handling **************************************/
// Create a session and session cookie
const oneDay = 1000 * 60 * 60;

app.use(sessions({
    name: 'SESS_NAME',
	secret: process.env.SESSION_SECRET || "thisismysecretkeyngrieugbitgk",
	store: MongoStore.create({
		mongoUrl: process.env.MONGODB_URI
	}),
	saveUninitialized: false,
    resave: false,
	cookie: {
        maxAge: oneDay
    }
}))

if (process.env.NODE_ENV !== 'prod') {
    app.use(cors({
        origin: "http://localhost:8080",
        credentials: true
    }))
}

app.set("trust proxy", 1)

app.use(express.static(path.join(__dirname, '../client/dist')));

function isMongoError(error) {
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// A route to login and create a session
app.post("/api/login", async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}
	try {
		const userFound = await user.findOne({ 'username': username })
		if (!user) {
			res.status(400).send("Incorrect username or password");
			return;
		}
		else {
			const match = await bcrypt.compare(password, userFound.password)
			if (match) {
				req.session.user = username;
				userFound.password = undefined;
				res.send(userFound)
			}
			else {
				res.status(400).send("Incorrect username or password")
			}
		}
	} catch (error) {
		log(error)
		res.status(400).send("Incorrect username or password")
	}
})

// A route to logout a user
app.get("/api/logout", async (req, res) => {
	req.session.destroy(error => {
		if (error) {
			res.status(500).send(error);
		} else {
			log("The user has been destroyed.")
			res.send()
		}
	});
})

// A route to check if a user is logged in on the session
app.get("/api/check-session", async (req, res) => {
	log("Session in check session: ", req.session)
	if (req.session.user) {
		try {
			const userFound = await user.findOne({ 'username': req.session.user });
			if (!userFound) {
				res.status(400).send()
			}
			else {
				userFound.password = undefined
				res.send(userFound);
			}
		} catch (error) {
			res.status(400).send()
		}
	} else {
		res.status(401).send();
	}
});

// to get all records present in record model containing everyday data of classes
app.get("/api/get_record", authenticate, (req, res) => {
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
app.get("/api/get_record_by_date/:date", authenticate, (req, res) => {
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
app.get("/api/get_record_by_name/:name", authenticate,  (req, res) => {
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
app.get("/api/get_record_by_both/:date/:name", authenticate,  (req, res) => {
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
app.post("/api/new_record_data", authenticate,  function(req, res) {
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
app.get("/api/get_student", authenticate, (req, res) => {
    student.find(function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});


// get students by name (can be multiple)
app.get("/api/get_student_by_name/:name", authenticate, (req, res) => {
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
app.get("/api/get_student_by_class/:class", authenticate, (req, res) => {
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
app.get("/api/get_student_by_both/:class/:name", authenticate, (req, res) => {
    student.findOne({class: req.params.class, name: req.params.name}, function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
            throw err;
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});

// add new user into user model
app.post('/api/new_user', authenticate, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const u = new user({
            username: req.body.username,
            title: req.body.title,
            password: hash
        })
        u.save()
        res.status(200).send("Successfully created.")
    }
    catch (error) {
        console.log(error)
        if (isMongoError(error)) {
            res.status(500).send("Internal server error")
        } else {
            res.status(400).send("Bad Request")
        }

    }
})


// add new student's data into student model
app.post('/api/new_student_data', authenticate, (req, res) => {
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
app.put('/api/update_student_class/:name/:class', authenticate, (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {class: req.body.class}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully updated", result: result});
        } else {
            res.json({status: 500, message: "Unable to update"});
        }
    });

});


// updating student's name
app.put('/api/update_student_name/:name/:class', authenticate, (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {name: req.body.name}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully updated", result: result});
        } else {
            res.json({status: 500, message: "Unable to update"});
        }
    });
});


// to delete a student (actually changes the status to false rather than deleting it permanently)
app.put('/api/delete_student/:name/:class', authenticate, (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {status: false}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully deleted", result: result});
        } else {
            res.json({status: 500, message: "Unable to delete"});
        }
    });
});


// to revive a student (actually changes the status to true rather than adding it again)
app.put('/api/revive_student/:name/:class', authenticate, (req, res) => {
    student.findOneAndUpdate({name: req.params.name, class: req.params.class}, {status: true}, (err, result) => {
        if (!err && result != null) {
            res.json({status: 200, message: "successfully revived", result: result});
        } else {
            res.json({status: 500, message: "Unable to revive"});
        }
    });
});


// get all assessments from records model
app.get("/api/get_assessments", authenticate, (req, res) => {
    record.find({}, 'assessment', function (err, found) {
        if (err) {
            res.json({status: 500, message: "Unable to retieve"});
        } else {
            res.json({status: 200, message: "retrieve successfully", result: found});
        }
    });
});



// get all assessments from records model of specific student
app.get("/api/get_assessments_by_student/:name/:class", authenticate, (req, res) => {
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
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Environment: ", process.env.NODE_ENV || "dev")
        console.log(`Listening on port ${port}...`)
    }
});