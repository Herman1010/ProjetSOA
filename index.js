const express = require('express');
const database = require('./src/database/db.config');
require('dotenv').config();
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
const cors = require('cors');
app.use(cors());
database.mongoose.connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}
).then(()=>{
    console.log('connected to database');
}
).catch(err => {
    console.log(err);
});