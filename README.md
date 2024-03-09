# GoofPass

GoofPass is a simple password manager written in C#.

## Security model

As a user registers, a hash (`PBKDF2` with 5001 iterations) of the password is calculated together with a salt and both are sent to the server to be stored. 
When the user logs in, the server sends the salt to the client, which then calculates the hash of the password and sends it to the server. 
The server then compares the hash with the stored hash. If they match, the user is authenticated with a signed json web token.

When an authenticated user wants to access their passwords a request is made to the server, which returns the encrypted passwords to the client. 
The client then decrypts the passwords using the hash of the master password (`PBKDF2` with 5000 iterations) and the plain text passwords are stored in a local vault.
The passwords are encrypted with `AES-256`.

If the user creates a new password, the password is encrypted with the hash of the master password and sent to the server to be stored.

![security model.png](img%2Fsecurity%20model.png)