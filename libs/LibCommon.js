// LibCommon
const {promisify} = require('util');

//
export default {
    string_to_obj:function(items){
        var ret = [];
        items.forEach(function(item){
            var row = JSON.parse(item || '[]')
    //        console.log( row );
            ret.push( row )
        });
        return ret;        
    },
    add_item :async function(client, item, entity_name ){
        var key_idx = "idx-" + entity_name;
        var key_sorted = "sorted-" + entity_name;
        const incrAsync = promisify(client.incr).bind(client);
        const zaddAsync = promisify(client.zadd).bind(client);
        const setAsync = promisify(client.set).bind(client);
        try{
            client.on("error", function(error){ console.error(error); });
            var reply = await incrAsync(key_idx);
            var key = entity_name + ":" + String(reply)
            console.log( key );
            await zaddAsync(key_sorted, reply, key);
            item.id = key;
            var json = JSON.stringify( item );
            await setAsync(key , json) 
            return 1;  
        } catch (e) {
            console.log(e);
            return 0;
        }    
    }    

}