var express = require('express');
var router = express.Router();

import LibAuth from "../libs/LibAuth"

/* GET home page. */
router.get('/', function(req, res, next) {
    try{
        var user = LibAuth.get_user(req)
        var mail = null
        var valid_login = false
        if(user != null){
            valid_login = true
            mail = user.mail
//            console.log(user.password );
        }
        var items ={ msg: "" }
        res.render('index.ejs', { 
            mail: mail ,valid_login: valid_login,
            items: items
        });
    } catch (e) {
        console.log(e);
    }  
});
//
router.get('/about', function(req, res, next) {
  res.render('about', { title: ' '});
});
//
router.get('/userlist', function(req, res) {
});
/******************************** 
* 
*********************************/
router.get('/logout', function(req, res) {
    res.clearCookie('user');
    res.redirect('/');
});

  
module.exports = router;
