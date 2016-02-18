(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?

// This method filters the master list of articles, selecting the ones
// with matching the id passed in. It's routed using page.js whenever
// the URL matches the structure "/article/:id". It accepts two parameters
// representing the context and the next callback in the chain, respectively.

// It defines the function articleData, which is used as the callback after
// the Article.findWhere method queries the main SQL table, SELECTing the
// rows which where the id field matches the :id passed in the URL. On
// callback, articleData saves those results to the "articles" property of
// the context object. It then fires off the next callback function, which
// in the call to page() in routes.js, will be "articlesController.index".

  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

// Much in the same way as the loadById method, this one selects articles
// where the author matches the name from the URL. Whenever the URL is of
// the form "/author/:authorName", the authorName parameter is passed in
// as a property of the context object and used to query the master SQL
// table using the Article.findWhere method, after all the "+" characters
// are replace()d with spaces. That method then executes authorData as a
// callback, which sets the "articles" property of the context object to
// the results of the query. "loadByAuthor" then runs next() to execute
// the next callback, which in this case will again be
// articlesController.index(). 

  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
