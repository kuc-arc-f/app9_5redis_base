var express = require('express');
var router = express.Router();
const redis = require("redis");
const {promisify} = require('util');
import LibCommon from "../libs/LibCommon"
import LibPagenate from "../libs/LibPagenate"

const client = redis.createClient();

const mgetAsync = promisify(client.mget).bind(client);
const zrevrangeAsync = promisify(client.zrevrange).bind(client);

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/tasks_index',async function(req, res) {
    var ret_arr = {ret:0, msg:""}
    var query = req.query;
//    var page = query.page; 
    var page = 1;
console.log( "page=",  page );
    LibPagenate.init();
    var page_info = LibPagenate.get_page_start(page);
    try{
        client.on("error", function(error){ console.error(error); });         
        var data = await zrevrangeAsync("sorted-task", page_info.start, page_info.end );
// console.log( data );
        var reply_books = await mgetAsync(data);
        var param = LibPagenate.get_page_items(data, reply_books)
        res.json(param); 
    } catch (e) {
        console.log(e);
        res.json(ret_arr);
    }
});
/******************************** 
* 
*********************************/
router.post('/tasks_new', (req, res) => {
    var ret_arr = {ret:0, msg:""}
    try{
        var data = req.body
        //console.log(data )
        var key_idx  = "idx-task";
        var key_head  = "task:";
        var key_sorted  = "sorted-task";
        client.on("error", function(error) {
            console.error(error);
        });    
        client.incr(key_idx, function(err, reply) {
            var key = key_head + String(reply)
            console.log( key );
            client.zadd(key_sorted , reply , key );
            var item = {
                title: data.title ,  
                content: data.content ,
                id: key,
            };
            var json = JSON.stringify( item );
            client.set(key , json , function() {
                var param = {"ret": 1 };
                res.json(param); 
            });
        });
    } catch (e) {
        console.log(e);
        ret_arr.msg = e
        res.json(ret_arr);        
    }    
}); 
/******************************** 
* 
*********************************/
router.get('/tasks_show/:id', function(req, res) {
    console.log(req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    client.get(req.params.id, function(err, reply_get) {
        console.log(reply_get );
        var row = JSON.parse(reply_get || '[]')
        var param = {"docs": row };
        res.json(param); 
    });     
});
/******************************** 
* 
*********************************/
router.post('/tasks_update', (req, res) => {
    var ret_arr = {ret:0, msg:""}
    try{
        var data = req.body
        console.log(req.body )  
        client.on("error", function(error) {
            console.error(error);
        });
        var key = data.id;
        var item = {
            title: data.title ,  
            content: data.content ,
            id: data.id,
        };
        var json = JSON.stringify( item );
    //console.log( json );
        client.set(key , json , function() {
            var param = {"ret": 1 };
            res.json(param);
        });          
    } catch (e) {
        console.log(e);
        ret_arr.msg = e
        res.json(ret_arr);        
    }
});
/******************************** 
* 
*********************************/
router.get('/tasks_delete/:id', function(req, res) {
    let data = req.body
console.log( req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    var key_sorted  = "sorted-task";  
    client.zrem(key_sorted , req.params.id , function() {
        var param = {"ret": 1 };
        res.json(param);
    });

});

/******************************** 
* 
*********************************/
router.post('/test1', (req, res) => {
    var ret_arr = {ret:0, msg:""}
    try{
        var data = req.body
        console.log(data )    
        res.json( data )
    } catch (e) {
        console.log(e);
        ret_arr.msg = e
        res.json(ret_arr);        
    }
});

module.exports = router;
