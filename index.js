let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let SettingsBill = require("./settings-bill")


let settingsBill = SettingsBill();

app.use(express.static('public'));


var exphbs  = require('express-handlebars');


const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {

    res.render('index',
     {setting: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      color: settingsBill.colorChanger()
    });
})
app.post('/settings', function (req, res) {

     settingsBill.setSettings({
         callCost: req.body.callCost,
         smsCost: req.body.smsCost,
         warningLevel: req.body.warningLevel,
         criticalLevel: req.body.criticalLevel
})
   res.redirect('/')
});
app.post('/action', function (req, res) {

    settingsBill.recordAction(req.body.actionType)
    
    res.redirect('/');
});
app.get('/actions', function (req, res) {
    res.render('actions', {actions: settingsBill.actions()});
});
app.get('/actions/:actionType', function (req, res) {
    let actionType = req.params.actionType;
    res.render('actions', {actions: settingsBill.actionsFor(actionType)});
});

let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
