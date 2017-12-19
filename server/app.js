const express = require('express')
const app = express()
let nunjucks  = require('nunjucks');

let bodyParser = require('body-parser');
let routes = require('./core/routes');
let config = require('./config');

nunjucks.configure('./views', {
    autoescape: true,
    express: app,
    cache: false,
});

app.set('view engine', 'html');
app.use('/', routes);

app.use('/static',express.static(__dirname+'/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.set('env', RunningEnv['development'])

// require('./nunjucks_helpers/main')(nunjucksEnv)

// app.use(function(req, res, next){
//   res.status(404);
//   res.render('404.html');
// });


app.listen(config.port, function () {
  console.log('Server started at PORT:'+config.port);
});
