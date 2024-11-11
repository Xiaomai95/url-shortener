# URL Shortener Microservice

This project is a simple URL shortener microservice, which allows the client to make a POST request of a URL and the microservice shortens the URL. The microservice also allows the shortened URL to be used in a redirect to the original URL. 

## Features:
- MongoDB & Mongoose: used to store original URL and shortened URL.
- dns.lookup method: verifies the URL submitted.
- urlencoded method: Express's urlencoded method parses URL-encoded data, allowing the data to be requested from request.body in the POST request.
- quickidgen: An npm package that generates a random id, used to create a shortened URL when the client makes a POST request with a valid URL.   

## Example response:

POST request of `https://www.google.com` -> response: 

```
{
    "original_url":"https://www.google.com/",
    "short_url":"6540520351",
    "_id":"6731d331aae0be894d9fc695","__v":0
}
```

