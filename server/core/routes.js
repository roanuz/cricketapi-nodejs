var express = require('express'),
router = express.Router();
var CricketAPIServices = require('./services');
// var CacherLogic = require('./cacherLogics');

router.get('/', function(req, res) {
    res.render('index.html')
});

router.get('/schedule/', function(req, res) {
    CricketAPIServices.scheduleResponse(null).then((response)=>{
        res.render('schedule.html', response=response)
    }).catch(function(err) {
        console.error('Oops we have an error', err);
    })
});

router.get('/schedule/:month/', function(req, res) {
    CricketAPIServices.scheduleResponse(req.params['month']).then((response)=>{
        res.render('schedule.html', response=response)
    }).catch(function(err) {
        console.error('Oops we have an error', err);
    })
});

router.get('/recent-matches/', function(req, res) {
    CricketAPIServices.recentMatchesResponse().then((response)=>{
        res.render('recent_matches.html', response=response)
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