const express = require("express");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/animal', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//model set up
const animalSchema = new mongoose.Schema({
  name: String,
  color:String
})

// create an object to that contains methods for mongoose to interface with MongoDB
const Animal = mongoose.model('Animal', animalSchema);
//
app.get('/', (req, res) => {
    arr = Animal.find({}, function (err, animal) {
        res.render('index', { arr: animal });
      })
})
app.get('/mongooses/new', function(req, res) {    
    res.render('add');
})
app.post('/add', (req, res) => {
  const record = new Animal({id :req.body.id, name : req.body.name, color: req.body.color}); 
  console.log(req.body.name);  
  record.save(function (err) {
    if (err) {
      console.log('something went wrong');
      console.log(record.errors);
      res.redirect('/mongooses/new', { errors: record.errors })
    }
    else {
      console.log('successfully added the animal!');
      console.log(record);
      res.redirect('/');
    }
  });
});
app.get('/mongooses/:id', (req, res) => {
  arr = Animal.findOne({_id:req.params.id}, function (err, animal) {
      console.log(arr);
      console.log('hi');
    res.render('display', { arr: animal });
  })

})
app.post('/destroy/:id', (req, res) => {
    Animal.remove({_id:req.params.id}, function (err, animal) {
      res.redirect('/');
    })
  
  })
  app.get('mongoose/edit/:id', (req, res) => {
    arr = Animal.findOne({_id:req.params.id}, function (err, animal) {
        console.log(arr);
        console.log('hi');
      res.render('edit', { arr: animal });
    })
  })
  app.post('/edit/:id', (req, res) => {
    arr = Animal.update({_id:req.params.id},{name:req.body.name},{color:req.body.color},function (err, animal) {
        if (err) {
            console.log('something went wrong');
            res.redirect('/mongooses/${req.params.id}')
          }
          else {
            console.log('successfully edtied  the animal page!');
            res.redirect('/mongooses/${req.params.id}')

          }
        });
      });
app.listen(3000, () => console.log("listening on port 3000"))