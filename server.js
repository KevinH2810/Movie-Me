
var express = require("express")
var app = express()
const cors = require('cors');
const { DB } = require('./db')
const config = require('./config/config')

const bodyParser = require('body-parser'); 

const DbInit = new DB()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

DbInit.init()
require('./routes')(app);

app.listen(config.app.port, () => console.log(`Express server currently running on port ${config.app.port}`));