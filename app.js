//jshint esversion:6
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);
// Chainable route handlers.
app.route("/articles").get(function(req, res){
  Article.find(function(err, articles){
    if(!err){
      res.send(articles);
    }
    else{
      res.send(err);
    }
  });
})
.post(function(req, res){
  const title = req.body.title;
  const content = req.body.content;
  const article = new Article({
    title: title,
    content: content
  });
  article.save(function(err){
    if(!err){
      res.send("Successfully added a new document.");
    }
    else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all documents");
    }
    else{
      res.send(err);
    }
  });
});
app.route("/articles/:article").get(function(req, res){
  articleName = req.params.article;
  Article.findOne({title: articleName}, function(err, article){
    if(article){
      res.send(article);
    }
    else{
      res.send("No articles matching that title was found.");
    }
  });
})
.put(function(req, res){
  articleTitle = req.body.title;
  articleContent = req.body.content;
  Article.update({title: req.params.article}, {title: articleTitle, content: articleContent},{overwrite: true}, function(err){
    if(!err){
      res.send("Successfully updated the article.");
    }
  });
})
.patch(function(req, res){
  Article.update({title: req.params.article}, {$set: req.body}, function(err){
    if(!err){
      res.send("Successfully updated the article.");
    }
    else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteOne({title: req.params.article}, function(err){
    if(!err){
      res.send("Successfully deleted the article.");
    }
    else{
      res.send(err);
    }
  });
});
app.listen(3000, function(){
  console.log("Server started on port:3000");
});
