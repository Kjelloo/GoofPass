### Server side
* **User registration**
  
  Controller endpoint that takes: (username, hashed password)
  User Service checks if username is unique, if so, adds user to database with hashed password.
  Returns status code.


* **User login**
  
  Controller endpoint that takes: (username, hashed password)
  Auth Service checks hashed password against hashed password in database. Returns token if successful.

  Returns status code.


* **Password fetching**
  Controller endpoint that takes: (username, token)
  Auth Service checks token and returns encrypted passwords.

  Returns encrypted passwords.


### Client side

* **User registration**
  
  User enters username and password. Password is hashed with PBKDF2 x100.01k and sent to server with username.

  Returns status code.

* **User login**
  
  User enters username and password. Password is hashed with PBKDF2 x100k and sent to server with username.

  Returns token if successful.

* **Password fetching**
  
  User sends token to server with username.

  Server returns encrypted passwords.
    
  Returns encrypted passwords.