# megan-backend

API Endpoint: https://megan-backend.herokuapp.com/notes/v1

## Documentation
### Authentication
**POST** - **SignUp**
```
https://megan-backend.herokuapp.com/notes/v1/signUp
```
User can create an account using this endpoint.

**Body**
```
{
    "userName": "Monkey D. Luffy",
    "password": "gomugomu"
}
```
**POST** - **SignIn**
```
https://megan-backend.herokuapp.com/notes/v1/signIn
```
After creating an account use this to log in.

**Body**
```
{
    "userName": "Monkey D. Luffy",
    "password": "gomugomu"
}
```
### Notes Management

**GET** - **Get your Notes** 
```
https://megan-backend.herokuapp.com/notes/v1
```
**Body**

```
{
    "userId": "9fcddea4-c7a3-471c-82b0-b18821d6789a",
    "token": "9c280e4573bbfb8d4ba267fd7accd14c46d87d9afda0f424ccc2a86ea3b4a38c",
    "note": "I am gonna be the King of the Pirates"
}
```
Use this endpoint to get all the existing notes.

Add a Note - **POST** - https://megan-backend.herokuapp.com/notes/v1/add

Update a Note - **POST** - https://megan-backend.herokuapp.com/notes/v1/update

Delete a Note - **DELETE** - https://megan-backend.herokuapp.com/notes/v1

