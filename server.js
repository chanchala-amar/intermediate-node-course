const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const User = require("./models/User");

mongoose.connect("mongodb://localhost/userData");
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});

// CREATE
app.post("/users", (req, res) => {
  // create new users
  User.create(
    {
      name: req.body.newData.name,
      email: req.body.newData.email,
      password: req.body.newData.password,
    },
    (err, data) => {
      if (err) {
        res.json({ success: false, msg: err });
      } else if (!data) {
        res.json({ success: false, msg: "Not Found" });
      } else {
        res.json({ success: true, msg: data });
      }
    }
  );
});

app
  .route("/users/:id")
  // READ
  .get((req, res) => {
    //return user info for a given user id
    User.findById(req.params.id, (err, data) => {
      if (err) {
        res.json({ success: false, msg: err });
      } else if (!data) {
        res.json({ success: false, msg: "Not Found!" });
      } else {
        res.json({ success: true, msg: data });
      }
    });
  })
  // UPDATE
  .put((req, res) => {
    //update existing user and return the udpated user info
    User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.newData.name,
        email: req.body.newData.email,
        password: req.body.newData.password,
      },
      { new: true },
      (err, data) => {
        if (err) {
          res.json({ success: false, msg: err });
        } else if (!data) {
          res.json({ success: false, msg: "Not Found" });
        } else {
          res.json({ success: true, msg: data });
        }
      }
    );
  })
  // DELETE
  .delete((req, res) => {
    //delete user with the given id
    User.findByIdAndDelete(req.params.id, (err, data) => {
      if (err) {
        res.json({ success: false, msg: err });
      } else if (!data) {
        res.json({ success: false, msg: "Not Found" });
      } else {
        res.json({ success: true, msg: data });
      }
    });
  });
