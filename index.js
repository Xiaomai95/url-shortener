require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const mongoose = require('mongoose');
const generateShortId= require('ssid')
const app = express();

//Middleware to parse URL-encoded data, used later in POST request
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Connect to Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Check connection
mongoose.connection.on('connected', () => {
  console.log('connected')
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

mongoose.connection.on('disconnected', () => {
  console.log('disconnected')
})



app.post('/api/shorturl', (req, res) => {
  let url =  new URL(req.body.url);
  let hostname = url.hostname
  console.log(hostname)
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({error: 'invalid url'})
    }
    return res.json({original_url: url, short_url: address})
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
