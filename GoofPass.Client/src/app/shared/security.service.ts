import { Injectable } from '@angular/core';
import crypto from "crypto";
import {AuthUserDto} from "./dtos/authuser.dto";
import {environment} from "../../environments/environment.development";
import {User} from "./dtos/user.dto";
import {PasswordEntryDecryptedDto} from "./dtos/passwordentrydecrypted.dto";
import {PasswordentryEncryptedDto} from "./dtos/passwordentryencrypted.dto";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  createUser(authUserDto: AuthUserDto): Promise<User> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(16);

      const iterations = environment.iterations;
      const keyLength = environment.keyLength;

      crypto.pbkdf2(authUserDto.password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {

          const user: User = {
            id: undefined,
            username: authUserDto.username,
            password: derivedKey,
            salt: salt,
            iv: iv
          };

          resolve(user);
        }
      });
    });
  }

  encryptPassword(passwordEntry: PasswordEntryDecryptedDto, key: Uint8Array): PasswordentryEncryptedDto {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, passwordEntry.iv);
    let encryptedPassword = cipher.update(Buffer.concat([passwordEntry.salt, Buffer.from(passwordEntry.decryptedPassword)]));

    encryptedPassword = Buffer.concat([encryptedPassword, cipher.final()]);

    return {
      id: undefined,
      userid: passwordEntry.userid,
      encryptedPassword: encryptedPassword,
      salt: passwordEntry.salt,
      iv: passwordEntry.iv
    };
  }

  decryptPassword(passwordEntry: PasswordentryEncryptedDto, key: Buffer): PasswordEntryDecryptedDto {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, passwordEntry.iv);
    let decryptedPassword = decipher.update(Buffer.concat([passwordEntry.encryptedPassword]));

    decryptedPassword = Buffer.concat([decryptedPassword, decipher.final()]);

    return {
      id: undefined,
      userid: passwordEntry.userid,
      decryptedPassword: decryptedPassword.toString().slice(16), // Remove salt
      salt: passwordEntry.salt,
      iv: passwordEntry.iv
    };
  }
}
