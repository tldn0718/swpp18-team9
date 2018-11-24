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
- **request body:**
- **response body:**


### /api/friend/:id
- **method: GET**
- **request body:**
- **response body:**
