var express = require('express'),
router = express.Router();
var CricketAPIServices = require('./services');
var CacherLogic = require('./cacherLogics');

router.get('/', function(req, res) {
    CricketAPIServices.recentMatchesResponse().then((response)=>{
        res.render('index.html', response=response)
    }).catch(function(err) {
        console.error('Oops we have an error', err);
    })
});

router.get('/match/:matchId/', function(req, res) {
    CricketAPIServices.getMatchResponse(req.params['matchId']).then((response)=>{
        res.render('match_card.html', response=response)
    }).catch(function(err) {
        console.error('Oops we have an error', err);
    })
});
module.exports = router;