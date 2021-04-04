A lambda function service to scrap the provided url and return og metadata if found.

Installation: Follow steps mentioned below to run the service locally.

1. Clone: https://github.com/akshayb25/web-scrapper-microservice.git

2. Install dependencies: npm install

3. modify .env with correct values

Run: npm run start

Test: npm run test

Usage: The function can be used by passing the payload as json to request body.

Payload Example:

{
    "url": "https://www.amazon.com/OPKALL-Compact-Adapter-Compatible-MacBook/dp/B08VGRXC29/"
}


