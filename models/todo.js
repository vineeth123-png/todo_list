const mongoose = require('mongoose');

let todoschema = mongoose.Schema({
    task : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('todo', todoschema);