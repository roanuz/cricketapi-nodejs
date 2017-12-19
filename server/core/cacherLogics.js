var MemcachePlus = require('memcache-plus');
var client = new MemcachePlus(); // localhost:11211

class CacherLogic {
    constructor(){
    }
    setCache(key, value, ttl) {
        let toDate = new Date();
        toDate = toDate.getTime(); // in timestamp
        let cache_expires = 120
        if(ttl>toDate){
            cache_expires = ttl - toDate / 1000
        }
        client
            .set(key, value, cache_expires)
            .then(function() {
                // This will never happen because an error will be thrown
                console.log('Succeffuly cached data for', key);
            })
            .catch(function(err) {
                // This will get hit!
                console.error('Oops we have an error', err);
            }
        );
    }
    
    getCachedData(key) {
        return new Promise((resolve,reject)=>{
            client
                .get(key)
                .then(function(data) {
                    // The user is a JS object:
                    if(data && data.card){
                        console.log('Successfully got the object', data.card.title);
                        resolve(data);
                    }
                    else{
                        resolve(false)
                    }
                    
                })
                .catch(function(err) {
                    // This will get hit!
                    console.error('Oops we have an error', err);
                    reject(err);
                });
        })
    }
}
module.exports = new CacherLogic;