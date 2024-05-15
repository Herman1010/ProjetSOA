const config = require('../config/config');
const mongoose=require('mongoose');
const db={};
mongoose.Promise=global.Promise;
mongoose.set('strictQuery',false);
db.mongoose=mongoose;
db.url=config.DB_URL;
db.articles = require('../models/article.model')(mongoose);
db.clients = require('../models/client.model')(mongoose);


module.exports=db;