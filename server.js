const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost/fullStackdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("DB connection established"))
    .catch(err => console.log("Failed to connect to the database"));

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [100, "Name can be a max of 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        minlength: [7, "Email must be at least 7 characters long"],
        validate: {
            validator: function(v){
                let re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                return re.test(v)
            },
            message: "Invalid email address"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    }
}, {timestamps: true})

const User = mongoose.model("User", UserSchema)
    // Read - All
app.get("/api/users", (req, res) => {
    User.find({})
        .then(data => res.json({message: "success", results: data}))
        .catch(err => res.json({ message: "error", results: err}));
    })

// Read - One
app.get("/api/users/:id", (req, res) => {
    User.findOne({_id: req.params.id})
        .then( data => res.json({message: "success", results: data}))
        .catch( err => res.json({ message: "error", results: err}));
})

// Create
app.post("/api/users", (req, res) => {
    User.create(req.body)
        .then( data => res.json({message: "success", results: data }))
        .catch( err => res.json(err));
})

// Update
app.put("/api/users/:id", (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id}, req.body, {runValidators: true, new: true})
        .then( data => res.json({message: "success", results: data}))
        .catch( err => res.json({ message: "error", results: err}));
})

// Delete
app.delete("/api/users/:id", (req, res) => {
    User.findByIdAndDelete({ _id:req.params.id})
        .then( data => res.json({message: "success", results: data}))
        .catch( err => res.json({ message: "error", results: err}));
});


app.listen(8000, () => console.log("Listening on port 8000"));