# GoofPass

GoofPass is a simple password manager written in Angular and ASP.NET Core.

Accounts can be registered with an email and a password, that also acts as the master password once hashed. 

### How to run

`GoofPass.Client` is the Angular client and `GoofPass.Server` is the ASP.NET Core server.

To run the client, navigate to the `GoofPass.Client` directory and run `npm install`.

If you don't have the Angular CLI installed, run `npm install -g @angular/cli`.
Then run `ng serve --port=4200`.

To run the server, navigate to the `GoofPass.Server.WebAPI` directory and run `dotnet run --urls=http://localhost:5266/`.

### Screenshots

![login.png](img%2Flogin.png)
![register.png](img%2Fregister.png)
![vault.png](img%2Fvault.png)
![create-password.png](img%2Fcreate-password.png)

### Threat actors

The purpose of GoofPass is to protect the user's passwords from unauthorized access. 
The main threat actors are hackers and malicious insiders. 
Hackers can try to intercept the user's passwords while they are being sent to the server or while they are stored on the server.
Malicious insiders can try to access the user's passwords by exploiting vulnerabilities in the server.

### Security model

As a user registers, a hash (`PBKDF2` with 100001 iterations) of the password is calculated together with a salt and both are sent to the server to be stored. 
When the user logs in, the server sends the salt to the client, which then calculates the hash of the password and sends it to the server. 
The server then compares the hash with the stored hash. If they match, the user is authenticated with a signed json web token.

When an authenticated user wants to access their passwords a request is made to the server, which returns the encrypted passwords to the client. 
The client then decrypts the passwords using the hash of the master password (`PBKDF2` with 5000 iterations) and the plain text passwords are stored in a local vault.
The passwords are encrypted with `AES-256`.

If the user creates a new password, the password is encrypted with the hash of the master password and sent to the server to be stored.

![security model.png](img%2Fsecurity%20model.png)

### Pitfalls and limitations

The security model is very simple. Right now, the server is not running on HTTPS, which means that requests can be intercepted and information can be stolne.
All passwords are encrypted during transport and storage, making it difficult for hackers to make use of them.
The JWT is signed and have an expiration, which means that it cannot be tampered with. However, it is not encrypted, which means that it can be read by anyone who intercepts it.
The master password is not stored on the server, which means that the server cannot decrypt the passwords. 
This is a good thing, but it also means that the user cannot recover their passwords if they forget their master password.
Once the user is logged in, the hash of the master password is stored in the client's local storage, 
this could be a security risk if the user is using a shared computer and does not logout.

The clients UI is bad and there is almost no error handling on the client side. 