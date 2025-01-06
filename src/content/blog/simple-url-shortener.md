---
title: "Simply - URL Shortener "
description: Documentation for using this Simple API
pubDate: "2023-11-29T09:00:00+05:30"
heroImage: /assets/pexels-andrea-piacquadio-840996.jpg
author: "Anish"
---

# Simply API Documentation

Welcome to the Simply URL Shortener API! This API allows you to shorten long URLs and provides a mechanism to redirect users to the original URL.You can also see how many times the shortened link has been clicked. Follow the documentation to integrate this service into your applications.

**Base URL:** `https://sl8.vercel.app`

## Shorten URL Endpoint

### Endpoint

`POST /api/url/shorten`

This endpoint is used to shorten a long URL.

#### Request

- **Method :** `POST`
- **URL:** `https://sl8.vercel.app/api/url/shorten`
- **Headers:**
  - `Content-Type: application/json`

##### Request Body :

```json
{
  "longUrl": "https://example.com/your-veryyy-longggggg-urllllll"
}
```

- longUrl (string): The long URL that you want to shorten.

##### Success Response :

- **Status Code**: 200
- **Body :**

```json
{
  "shortUrl": "https://sl8.vercel.app/shorty",
  "clickCount":7
}
```

- shortUrl (string): The Shortened URL
- clickCount (Integer): Number of times the Link has been clicked

**Error Responses :**

- **Status Code: 400 Bad Request**
- **Body :**

```json
{
  "error": "Invalid input. Please provide a valid longUrl."
}
```

- **Status Code: 500 Internal Server Error**
- **Body :**

```json
{
  "error": "Internal server error. Please try again later."
}
```

## Example :

# Request :

```
curl -X POST -H "Content-Type: application/json" -d '{"longUrl": "https://example.com/your-long-url"}' https://sl8.vercel.app/api/url/shorten
```

in Node.js:

```js
const axios = require('axios');

const shortenUrl = async (longUrl) => {
  try {
    const url = 'https://sl8.vercel.app/api/url/shorten';
    const response = await axios.post(url, { longUrl }, { withCredentials: true, crossDomain: true });
    console.log('Shortened URL:', response.data.shortUrl);
    console.log('Click Count:', response.data.clickCount);
  } catch (error) {
    console.error('Error shortening URL:', error.message);
  }
};

// Example Usage
const exampleLongUrl = 'https://example.com/yourrr-longgg-url';

shortenUrl(exampleLongUrl);

```

# Response :
in Json Format:
```json
{
  "shortUrl":"https://sl8.vercel.app/Something",
  "clickCount":1
}
```
#### See it in Action :

- [Simply](https://simplifyy.vercel.app/dashboard/url-shortener)

![Simply Screenshot](https://imgur.com/cop3A6d.png)