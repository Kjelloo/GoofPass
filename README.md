# GoofPass

GoofPass is a simple password manager written in Angular and ASP.NET Core.

Accounts can be registered with an email and a password, that also acts as the master password once hashed. 

### How to run

To run the client, navigate to the `GoofPass.Client` directory and run `npm install`.

If you don't have the Angular CLI installed, run `npm install -g @angular/cli` and then `ng serve --port=4200`.

To run the server, navigate to the `GoofPass.Server.WebAPI` directory and run `dotnet run --urls=http://localhost:5266/`.

If you wish to run the application with https you can run the server with `dotnet run --urls=https://localhost:5266/`.

And the client with `ng serve --ssl --ssl-key .\key.pem --ssl-cert .\cert.pem --c production` (on windows).

The server uses a self-signed certificate, so you will have to accept the certificate in your browser.

### Screenshots

![login.png](img%2Flogin.png)
![register.png](img%2Fregister.png)
![vault.png](img%2Fvault.png)
![create-password.png](img%2Fcreate-password.png)

### Security considerations

The passwords should be encrypted before they are sent to the server, and only be decrypted on the client side.

It is important that the server never has access to the users master password or the hash of the master password, 
in case of a data breach, only the encrypted passwords are compromised. The master password should always stay with the user. 

To give users access to their encrypted passwords, an authentication hash (generated on registration) is stored on the server used for validation.
Once the user is authenticated, the server sends a token to the client, which is used to authenticate the user in future requests, 
such as requesting the encrypted passwords. The tokens should have an expiration time and be signed to prevent tampering, 
preferably an expiration time of 10 minutes to prevent potential brute force attacks if the token is compromised.

The short expiration time of the tokens should not be a usability issue, since looking up passwords and adding them is not something that takes a lot of time.

The server should also be able to handle a large amount of requests, since the passwords are encrypted and decrypted on the client side.

### Threat actors

The main threat actors are hackers that possibly could intercept communication between the client and the server. 
Through man-in-the-middle attacks, hackers could intercept the JWT and use it to access the users encrypted passwords.
Since they are encrypted, the hacker would also need to know the master password to decrypt them, if the user has a weak master password, 
the hacker could potentially brute force it, if they have knowledge of the encryption algorithm and the number of iterations used to hash the master password.


Malicious insiders can also pose a threat, since the database itself is not encrypted, a malicious insider could potentially access the encrypted passwords and brute force 
the master password.

### Security model

As a user registers, a hash (`PBKDF2` with 100001 iterations) of the password is calculated together with a salt and both are sent to the server to be stored. 
When the user logs in, the server sends the salt to the client, which then calculates the hash of the password and sends it to the server. 
The server then compares the hash with the stored hash. If they match, the user is authenticated with a signed json web token.

When an authenticated user wants to access their passwords a request is made to the server, which returns the encrypted passwords to the client if the users token is valid. 
The client then decrypts the passwords using the hash of the master password (`PBKDF2` with 100000 iterations) and the plain text passwords are stored in a local vault (in memory).
The passwords are encrypted with `AES-256`.

If the user creates a new password, the password is encrypted with the hash of the master password, a salt and iv and sent to the server to be stored.

![security model.png](img%2Fsecurity%20model.png)

### Pitfalls and limitations

The JWT used for authentication are signed and have an expiration (10 minutes), which means that it cannot be tampered with. However, it is not encrypted, which means that it can be read by anyone who intercepts it, exposing the users id and email.
It can also be used to access the users encrypted passwords. 

The calculation of the master passwords hash, and all encryption and decryption being done on the client side, is good security-wise, but drastically increases load times and could 
potentially be a problem for users with slow computers.

Once the user is logged in, the hash of the master password is stored in the client's local storage, 
this could be a security risk if the user becomes a victim of a cross-site scripting attack.

The clients UI is bad and there is almost no error handling on the client side. 