const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const User = require("./models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost/userData");
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});

//helper function to handle response
function sendResponse(res, err, data) {
  if (err) {
    res.json({ success: false, msg: err });
  } else if (!data) {
    res.json({ success: false, msg: "Not Found" });
  } else {
    res.json({ success: true, msg: data });
  }
}

// CREATE
app.post("/users", (req, res) => {
  //encrypt the password before storing in the db
  bcrypt.hash(req.body.newData.password, saltRounds, function (err, hash) {
    if (err) {
      res.json({ success: false, msg: err });
    } else {
      //create a temp user and substitue the pain text password with encrypted password
      let tempUser = { ...req.body.newData };
      tempUser.password = hash;

      // create new users
      User.create(tempUser, (err, data) => sendResponse(res, err, data));
    }
  });
});

app
  .route("/users/:id")
  // READ
  .get((req, res) => {
    //return user info for a given user id
    User.findById(req.params.id, (err, data) => sendResponse(res, err, data));
  })
  // UPDATE
  .put((req, res) => {
    //update existing user and return the udpated user info
    User.findByIdAndUpdate(
      req.params.id,
      { ...req.body.newData },
      { new: true },
      (err, data) => sendResponse(res, err, data)
    );
  })
  // DELETE
  .delete((req, res) => {
    //delete user with the given id
    User.findByIdAndDelete(req.params.id, (err, data) =>
      sendResponse(res, err, data)
    );
  });
