var express = require('express'),
router = express.Router();
var CricketAPIServices = require('./services');
var CacherLogic = require('./cacherLogics');

router.get('/', function(req, res) {
    res.render('index.html')
});

router.get('/match/:matchId/', function(req, res) {
    let apiPath = '/rest/v2/match/'+req.params['matchId']+'/';
    let params = {}
    let cacheKey = 'match|'+req.params['matchId']+'|full_card';

    CacherLogic.getCachedData(cacheKey).then((cachedResponse)=>{
        if(cachedResponse&& cachedResponse != null) {
            console.log('cached data');
            res.render('match_card.html', response=cachedResponse)
        }
        else{
            console.log('new data');
            CricketAPIServices.getData(apiPath,params).then((response)=>{
                res.render('index.html', response=response.data)
            })
        }
        
    }).catch(function(err) {
        // This will get hit!
        console.error('Oops we have an error', err);
    })
});
module.exports = router;