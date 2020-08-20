# Reddit Application API spec

This is just a simple reddit backend clone for learning purposes :smiley:

## `GET /posts`

### Request

Headers:

- Accept: `application/json`
- (Optional) Username: username

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`

Body:

```json
{
  "posts": [
    {
      "id": 25,
      "title": "Dear JavaScript",
      "url": "http://9gag.com",
      "timestamp": 1494339525,
      "score": 791,
      "owner": null,
      "vote": 1
    },
    {
      "id": 74,
      "title": "Crockford",
      "url": "http://9gag.com",
      "timestamp": 1494138425,
      "score": 567,
      "owner": "kristof4",
      "vote": -1
    }
  ]
}
```

## `POST /posts`

### Request

Headers:

- Accept: `application/json`
- Content-Type: `application/json`
- Username: Kristof4

Body:

```json
{
  "title": "Crockford",
  "url": "http://9gag.com"
}
```

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`

Body:

```json
{
  "id": 74,
  "title": "Crockford",
  "url": "http://9gag.com",
  "timestamp": 1494138425,
  "score": 0,
  "owner": "kristof4",
  "vote": 0
}
```

## `PUT /posts/<id>/upvote`

### Request

Headers:

- Accept: `application/json`
- Username: username

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`

Body:

```json
{
  "id": 74,
  "title": "Crockford",
  "url": "http://9gag.com",
  "timestamp": 1494138425,
  "score": 1,
  "owner": "kristof4",
  "vote": 1
}
```

## `PUT /posts/<id>/downvote`

### Request

Headers:

- Accept: `application/json`
- Username: username

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`

Body:

```json
{
  "id": 74,
  "title": "Crockford",
  "url": "http://9gag.com",
  "timestamp": 1494138425,
  "score": -1,
  "owner": "kristof4",
  "vote": -1
}
```

## `DELETE /posts/<id>`

### Request

Headers:

- Accept: `application/json`
- Username: username

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`
- Username: username

Body:

```json
{
  "id": 25,
  "title": "Dear JavaScript",
  "url": "http://9gag.com",
  "timestamp": 1494339525,
  "score": 791,
  "owner": null,
  "vote": 1
}
```

## `PUT /posts/<id>`

### Request

Headers:

- Accept: `application/json`
- Content-Type: `application/json`
- Username: username

Body:

```json
{
  "title": "modified title",
  "url": "http://facebook.com"
}
```

### Response

Status Code: 200

Headers:

- Content-Type: `application/json`

Body:

```json
{
  "id": 25,
  "title": "modified title",
  "url": "http://facebook.com",
  "timestamp": 1494339525,
  "score": 791,
  "owner": null,
  "vote": 1
}
```
