require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const mongoose = require('mongoose');
const generateRandomId = require('quickidgen');
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
mongoose.connect(process.env.MONGO_URI);

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

//Create schema - blueprint for the model
const urlSchema = new mongoose.Schema(
  {
    original_url: String,
    short_url: String
  }
);

//Create model
const urlModel = mongoose.model('URL', urlSchema)

app.post('/api/shorturl', async (req, res) => {
  let url =  new URL(req.body.url); //urlencoded middleware allows access to req.body
  let hostname = url.hostname
  dns.lookup(hostname, async (err) => {
    if (err) {
      return res.json({error: 'invalid url'})
    }
    
    let shortUrl = generateRandomId({
      length: 10,
      useNumbers: true,
      useLowercase: false,
      useUppercase: false,
      useSpecialChars: false,
    });
    
    try {
      let newEntry = new urlModel({original_url: url, short_url: shortUrl})
      const result = await newEntry.save()
      return res.json(result)
    } catch (e) {
      return res.status(500).json({error: 'error saving to database'})
    }
  })
})

//endpoint to redirect to original url
app.get('/api/shorturl/:shortUrl',  async (req, res) => {

  try {
    let shortUrlParam = Number(req.params.shortUrl);
    let urlQuery = urlModel.where({short_url: shortUrlParam})
    let findUrl = await urlQuery.findOne();

    if (findUrl) {
      return res.redirect(findUrl.original_url)
    }
    else {
      return res.status(404).json({error: 'Could not find short url'})
    }

  } catch (e) {
    return res.status(500).json({error: 'Invalid url'})
  }
    
  });

  
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
