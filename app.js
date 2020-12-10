const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// require todo schema and storing mongodb to local database.
const Todo = require('./models/todo');
mongoose.connect('mongodb://localhost/todo');
let db = mongoose.connection;

// log to console when mongodb is connected.
db.once('open', () =>{
    console.log('mongodb connected');
});

// log errors to console.
db.on('err', (err) =>{
    console.err(err);
});

app.get('/', (req, res) =>{
    let messages = [];
    Todo.find({}, (err, todos) =>{
        if(err) console.log(err);
        else res.render('index', {messages: messages, todo: todos});
    });
});


app.post('/', (req, res) =>{
    let messages = [];
    let a = req.body.task;
    if(a.length != 0) {
        let todo = new Todo();
        todo.task = a;
        todo.save((err) =>{
            if(err) console.log(err);
            else {
                messages.push({fail: 0, message: 'task added'});
                console.log(messages.length);
                console.log(messages);
                Todo.find({}, (err, todos) =>{
                    res.redirect('/');
                });
            }
        });
    } else {
        messages.push({fail: 1, message: 'add a valid task'});
        console.log(messages.length);
        console.log(messages);
        Todo.find({}, (err, todos) =>{
            res.render('index', {messages: messages, todo: todos});
        });
    }
});

app.get('/edit/:id', (req, res) =>{
    let messages = [];
    Todo.findById({_id:req.params.id}, (err, todos) =>{
        if(err) console.log(err);
        else {
            res.render('edit', {messages: messages, todo: todos});
        }
    });
});

app.post('/edit/:id', (req, res) =>{
    let messages = [];
    let a = req.body.task;
    if(a.length != 0) {
        let task = {task:a};
        Todo.updateOne({_id: req.params.id}, task, (err, todos) =>{
            if(err) console.log(err);
            else {
                messages.push({fail: 0, message: 'task added'});
                console.log(messages.length);
                console.log(messages);
                Todo.find({}, (err, todos) =>{
                    res.redirect('/');
                });
            }
        });
    } else {
        messages.push({fail: 1, message: 'add a valid task'});
        console.log(messages.length);
        console.log(messages);
        Todo.findById({_id: req.params.id}, (err, todos) =>{
            res.render('edit', {messages: messages, todo: todos});
        });
    }
});

app.get('/delete/:id', (req, res) => {
    let messages = [];
    Todo.deleteOne({_id: req.params.id}, (err) =>{
        if(err) console.log(err);
        else {
            messages.push({fail: 0, message: 'task deleted'});
            console.log(messages.length);
            console.log(messages);
            Todo.find({}, (err, todos) =>{
                res.render('index', {messages: messages, todo: todos});
            });
        }
    });
});



// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if(err) console.log(err);
    else console.log(`listening at ${PORT}!!!`);
});