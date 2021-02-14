const express = require("express");
const cors = require("cors");
const memesSchema = require("./models/memes"); // mongoose schema
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8081; //using PORT 8080 if not assigned

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
	// used for development mode only
	require("dotenv").config(); //Get data from .env file
}

// Connecting MongoDB
try {
	mongoose.connect(process.env.mongo_DB_Connection, {
		//stored in .env file
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log("MongoDb connected successfully!");
} catch (error) {
	console.log(error);
}

//Adding endpoints for the backend

// Endpoint #1 For knowing status
// Responds with 200 status code if connected
app.get("/status", (req, res) => {
	res.status(200).send({ status: 200 });
});

// Endpoint #2 for getting 100 latest memes.
// Sends sorted data based on date or sends 409 error.
app.route("/memes").get((req, res) => {
	function GetSortOrder(prop) {
		// Sort based on date
		return function (a, b) {
			if (a[prop] > b[prop]) {
				return -1;
			} else if (a[prop] < b[prop]) {
				return 1;
			}
			return 0;
		};
	}

	memesSchema.find({}, (err, values) => {
		if (err)
			// Error send 404
			res.send(404).send(err.message);
		// Success
		else res.json(values.sort(GetSortOrder("date")).slice(0, 100)); //Get sorted order with latest 100 memes only
	});
});

// Endpoint #3 for uploading a meme
// Sends 409 error if already present or responds with id.
app.post("/memes", async (req, res) => {
	let memeobj = new memesSchema(req.body);
	memeobj.date = new Date(); //store a value which will be used for sorting.
	memesSchema.findOne(
		{ name: memeobj.name, caption: memeobj.caption, url: memeobj.url },
		(err, existingMeme) => {
			if (existingMeme !== null) {
				//error send 409 error
				res.status(409).send("Meme already exists");
			} else {
				// post meme to database and respond with generated id
				memeobj
					.save()
					.then((k) => {
						res.json({
							id: k._id, //respond with generated id only
						});
					})
					.catch((e) => {
						res.status(500).send(e.message);
					});
			}
		}
	);
});

// Endpoint #4 for getting meme with specific ID
// responds with the data if present or 404 status code.
app.get("/memes/:id", (req, res) => {
	const id = req.params.id;
	memesSchema.findById(id, (err, values) => {
		if (err)
			//Meme not found respond with 404
			res.status(404).send("Cannot find the meme with mentioned id");
		//Meme found respond with appropriate data
		else res.json(values);
	});
});

// Endpoint #5 for updating a meme with specific ID
// Used for updating and responds with 404 if Meme ID not present.
app.patch("/memes/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updateObject = req.body;
		try {
			const updated = await memesSchema.findByIdAndUpdate(id, updateObject, {
				new: true,
			});
			res.status(200).send(updated); //meme present then update and send updated data
		} catch (error) {
			res.status(404).send("Meme not found"); //meme not present so send 404
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
});

app.listen(PORT, (err) => {
	if (err) console.log(err);
	else console.log(`Server is running on Port ${PORT}`);
});
