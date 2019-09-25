let express = require('express');
let app = express();
let bodyParser = require('body-parser');
var moment = require('moment');
moment().format();

let SettingsBill = require("./settings-bill")

let settingsBill = SettingsBill();

app.use(express.static('public'));


var exphbs = require('express-handlebars');


const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {

    res.render('index',
        {
            setting: settingsBill.getSettings(),
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
    var time = settingsBill.actions()
    for (const iterator of time) {
        iterator.ago = moment(iterator.timestamp).fromNow()
    }
    res.render('actions', { actions: time });
}); 
app.get('/actions/:actionType', function (req, res) {
    let actionType = req.params.actionType;
    var time = settingsBill.actionsFor(actionType)
    for (const iterator of time) {
        iterator.ago = moment(iterator.timestamp).fromNow()
    }
    res.render('actions', { actions: time });
});

let PORT = process.env.PORT || 3015;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
