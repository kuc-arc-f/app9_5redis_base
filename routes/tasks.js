var express = require('express');
var router = express.Router();

/* GET users listing. */
//  res.send('respond with a resource-1234');
/******************************** 
* 
*********************************/
router.get('/', function(req, res, next) {
    var query = req.query;
    var page = 1;
    if(query.page != null){
        page = query.page
        console.log( "page=", page )
    }  
    res.render('tasks/index', {"page": page } );
});

/******************************** 
* 
*********************************/
router.get('/new', function(req, res, next) {
    res.render('tasks/new', {});
  });

router.get('/show/:id', function(req, res) {
console.log(req.params.id  );
//{ title: 'Express'}
    res.render('tasks/show', {"params_id": req.params.id });
});

router.get('/edit/:id', function(req, res) {
  console.log(req.params.id  );
  //{ title: 'Express'}
      res.render('tasks/edit', {"params_id": req.params.id });
});
/******************************** 
* 
*********************************/
router.get('/import_task', function(req, res, next) {
    res.render('tasks/import_task', {});
});

module.exports = router;
