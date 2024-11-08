# URL Shortener Microservice

[What?]

# Features:
- MongoDB to store original url's 
- dns to verify the URL submitted, returning a json with error if error exists
- middleware: Express' urlencoded method to parse URL-encoded data, allowing the data to be requested from request.body in the POST request.
- ssid: An npm package that generates by default a 8-character random string, used here to create shortened URLs. Repo: github.com/rohitnirban/ssid 
