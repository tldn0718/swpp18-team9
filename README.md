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
`Requests users whose firstname + lastname includes the query param indicated by /:term`
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

### /api/user/
- **method: POST**
`Requests user infos with given node info`
- **request body:**
```
{
  selectedNodes<UserNode[]>: [
    {id: 3, label: 'John'},
    {id: 15, label: 'David'},
    ...
  ]
}
```
- **response body:**
```
{
  selectedUsers<User[]>: [
    {id: 3, firstName: 'John', lastName: 'Doe'},
    {id: 15, firstName: 'David', lastName: 'Yeon'},
    ...
  ]
}
```

### /api/post/get/
- **method: POST**
`Get posts with the tags of given users`
- **request body:**
```
{
  selectedUsers<User[]>: [
    {id: 3, firstName: 'John', lastName: 'Doe'},
    {id: 15, firstName: 'David', lastName: 'Yeon'},
    ...
  ]
}
```
- **response body:**
```
{
  posts<Post[]>: [
    {id: 1, content: 'First Post', tags: [3, 15, ...]},
    {id: 2, content: 'Second Post', tags: [3, 15, ...]}, 
    ...
  ]
}
```

### /api/post/write/
- **method: GET**
`Create a new post with the tags of given users`
- **request body:**
```
{
  selectedUsers<User[]>: [
    {id: 3, firstName: 'John', lastName: 'Doe'},
    {id: 15, firstName: 'David', lastName: 'Yeon'},
    ...
  ],
  content<string>: 'New post content'
}
```
- **response body:**
```
{
  message: 'success' | 'fail'
}
```
