# YEON

## API

### /api/token/
- **method: GET**
- **params:** `none required`
- **response body:** `none required`

### /api/signup/
- **method: POST**
- **request body:**
```
Account {
  username: string,
  password: string,
  firstName: string,
  lastName: string
}
```
- **response:**
```
{
  status: 201 | 403 | 500,
  message: 'signup_success' | 'signup_failed' | 'internal_server_error'
}
```

### /api/signin/
- **method: POST**
- **request body:**
```
{
  username: string,
  password: string
}
```
- **response body:**
```
Profile {
  account: Partial<Account> {
    username: string,
    firstName: string,
    lastName: string
  },
  friends: Profile[]
}
```

### /api/signout/
- **method: GET**
- **params:** `none required`
- **response body:** `none required`

### /api/graph/
- **method: GET**
- **request body:** `none required`
- **response body:**
```
{
  users: {
    id: number,
    label: string,
  }
  friends: {
    from: number,
    to: number,
  }
}
```

### /api/graph/:level
- **method: GET**
- **request body:** `none required`
- **response body:**
```
{
  users: {
    id: number,
    label: string,
  }
  friends: {
    from: number,
    to: number,
  }
}
```

### /api/friend/
- **method: GET**
- **request body:** `none required`
- **response body:**
```
{
  0: {
    id: number,
    content: string,
    select: boolean, #represent that it should show 'accept' and 'decline' buttons
    datetime: string,
    read: boolean,
    },
  1: {
  ...
  },
  ...
}
```

- **method: PUT** `This api sets all notificaions of user as read`
- **request body:** `none required`
- **response body:** `none required`


### /api/friend/:id
- **method: POST** `This api create a notification each to sender to receiver. id means the receiver's user id`
- **request body:** `none required`
- **response body:**
```
{
  createdTime: string
}
```
- **method: PUT**
`This api modifies a notification after receiver accepts or declines the request. id means the id of notification of receiver`
- **request body:**
```
{
  answer: 'accept' | 'decline'
}
```
- **response body:** `none required`

### /api/search/:term/
- **method: GET**
- **request body:** `none required`
- **response body:**
```
{
  results: [
    {
      id: string,
      firstName: string,
      lastName: string
    },
    {
      ...
    },
    ...
  ]
}
```
