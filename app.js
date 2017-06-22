var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true})); //use it for req.body to work
app.set('view engine','ejs');

// connect mongoose
mongoose.connect('mongodb://localhost/blog');
// fake data

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now}
    
});

var Blog = mongoose.model('Blog', blogSchema);

// ROOT route
app.get('/', function(req, res){
    res.redirect('/blogs');
});

// INDEX Route
app.get('/blogs', function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.send(err);
        }else{
            // console.log(blogs);
            res.render('index',{ blogs: blogs });
        }
    });
});

// NEW Route

app.get('/blogs/new', function(req, res){
   res.render('new'); 
});

// POST route

app.post('/blogs', function(req, res){
    console.log(req.body);
    Blog.create(req.body.blog, function(err){
      if(err){
          res.redirect('/blogs');
      } else{
          res.redirect('/blogs');
      }
    });
    
});

// Show route

app.get('/blogs/:id', function(req, res){
    var blogId = req.params.id;
    Blog.findById(blogId, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            // console.log(foundBlog);
            res.render('show',{blog: foundBlog});
        }
    });
});

// Edit Route - show form with values
app.get('/blogs/:id/edit', function(req, res){
    var blogId = req.params.id;
   Blog.findById(blogId , function(err, foundBlog){
       if(err){
           res.redirect('/blogs');
       }else{
           res.render('edit', {blog: foundBlog});
       }
   });
});

// Update route

app.put('/blogs/:id', function(req, res){
//   res.send("Update"); 
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect('/blogs');
       } else{
           res.redirect('/blogs/' + req.params.id);
       }
    });
});


// Remove route
app.delete('/blogs/:id', function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect('/blogs');
      } else{
          res.redirect('/blogs');
      }
   }); 
});

// listen

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is up and running!');
})