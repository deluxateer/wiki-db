const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB',  { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

const Article = mongoose.model('Article', articleSchema);

// ======================= Requests Targeting All Articles

app.route('/articles')

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if(!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const { title, content } = req.body;
  
    const newArticle = new Article({ title, content });
  
    newArticle.save(function(err) {
      if(!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if(!err) {
        res.send('Successfully deleted all articles');
      } else {
        res.send(err);
      }
    });
  });

// ======================= Requests Targeting Specific Articles

app.route('/articles/:articleTitle')
  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('No articles matching that title was found.');
      }
    });
  })
  .put(function(req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function(err) {
        if(!err) {
          res.send('Successfully updated articles.');
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function(err) {
        if(!err) {
          res.send('Successfully updated articles.');
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function() {
  console.log('Server running on port 3000');
});