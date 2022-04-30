require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {v4:uuidv4} = require('uuid');
const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(session({
    secret:uuidv4(),
    resave: false,
    saveUninitialized: true,
    maxAge: Date.now() + (30 * 86400 * 1000) 
  }))


const db = require('./knex/knex');
const routes = require('./routes/route');
app.use('/api/',routes);
app.get('/', (req, res) => {
  res.send('Home Page for Housing Prediction API!');
})

// test database connection
const testdb = async () => {
    try 
    {
      const testKnexConnection = await db.raw("SELECT 1+1");
    }
    catch(err) 
    {
      console.log("Database Connection Error");
      console.log(err);
    }
  }

app.listen(port, () => {
  testdb();
  console.log(`Server listening on port ${port}`)
})


