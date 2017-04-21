var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to mlab database
mongoose.connect('mongodb://lvu:8Evh&IsdLh5J@ds135069.mlab.com:35069/todo-lvu');

// create database schema
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

// var data = [{item: 'bach'}, {item: 'straus'}, {item: 'vivaldi'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {

  app.get('/', function (req, res) {
    // get data from mongo db, pass to view
    Todo.find({}, function (err, data) {
      if (err) throw err;
      res.render('todo', {todos: data});
    });
  });
  
  app.post('/', urlencodedParser, function (req, res) {
    // get data from view, add to mongo db
    var newTodo = Todo(req.body).save(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/:item', function (req, res) {
    // delete the requested item from mongo db
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });
};