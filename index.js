require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
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
