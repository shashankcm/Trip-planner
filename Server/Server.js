const express = require("express");
const mongo = require("mongodb").MongoClient;

const mongoDatabaseURL = "mongodb://localhost:27017";

const app = express();
app.use(express.json());

/** Start of MongoDB Database connections and creating collections */
let db, trips, expenses;
mongo.connect(mongoDatabaseURL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log("MongoDB connection error", err);
    return;
  }
  db = client.db("tripcost");
  trips = db.collection("trips");
  expenses = db.collection("expenses");
});
/** End of MongoDB Database connections and creating collections */

/** Start - API's for Trip Planner */

//Post New Trip

app.post("/trip", (req, res) => {
  const name = req.body.name;
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.log("Create New Trip Error", err);
      res.status(500).json({ err: err });
      return;
    }
    console.log("New Trip data inserted", result);
    res.status(200).json({ ok: true });
  });
});

// Get all Trips Information
app.get("/trips", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.log("There is No Trips recorded in our database", err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

//Add Expenses to a Trip

app.post("/expenses", (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description
    },
    (err, result) => {
      if (err) {
        console.log("Unable to add Expenses", err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(500).json({ ok: true });
    }
  );
});

/** End - API's for Trip Planner */

/** Start of server */
app.listen(7000, () => {
  console.log("Trip planner server => 7000");
});
/** End of server */
