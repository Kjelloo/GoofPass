import {Injectable} from '@angular/core';
import {AuthUserDto} from "./dtos/authuser.dto";
import {environment} from "../../environments/environment.development";
import CryptoJS from 'crypto-js';
import {RegisterUserDto} from "./dtos/RegisterUserDto";

function base64ToUint32Array(base64: string) {
  // Decode Base64 to binary string
  let binaryString = atob(base64);

  // Create Uint8Array from binary string
  let uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // Create ArrayBuffer from Uint8Array
  let arrayBuffer = uint8Array.buffer;

  // Create Uint32Array from ArrayBuffer
  return new Uint32Array(arrayBuffer);
}

let keyLength = environment.keyLength;
let iterations = environment.iterAuth;

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }
  async createUser(authUserDto: AuthUserDto): Promise<RegisterUserDto> {
    let salt = CryptoJS.lib.WordArray.random(16);
    console.log(CryptoJS.enc.Base64.stringify(salt));

    let key = CryptoJS.PBKDF2(authUserDto.password, salt,
      { keySize: keyLength / 32, iterations: iterations});

    return {
      email: authUserDto.email,
      password: CryptoJS.enc.Base64.stringify(key),
      salt: CryptoJS.enc.Base64.stringify(salt),
    };
  }

  async createKey(password: string, salt: string): Promise<string> {
    console.log(salt);
    let slt = CryptoJS.enc.Base64.parse(salt);
    let key = CryptoJS.PBKDF2(password, slt,
      { keySize: keyLength / 32, iterations: iterations});

    console.log(CryptoJS.enc.Base64.stringify(key));

    return CryptoJS.enc.Base64.stringify(key);
  }

    // import key from password
    // const key = await crypto.subtle.importKey(
    //   "raw",
    //   enc.encode(authUserDto.password),
    //   {name: "PBKDF2"},
    //   true,
    //   ["deriveBits", "deriveKey", "wrapKey", "unwrapKey"]
    // );
    //
    // // derive key from imported key
    // return new Promise(async (resolve, reject) => {
    //
    //   try {
    //     //
    //     const derivedKey = await crypto.subtle.deriveKey(
    //       {
    //         name: "PBKDF2",
    //         salt: salt,
    //         iterations: iterations,
    //         hash: "SHA-512"
    //       },
    //       key,
    //       {name: "AES-CBC", length: keyLength},
    //       true,
    //       ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    //     );
    //     let pass;
    //
    //     crypto.subtle.wrapKey("raw", derivedKey, key, "AES-CBC").then((wrappedKey) => {
    //       pass = wrappedKey;
    //     });
    //
    //     const user: User = {
    //       id: undefined,
    //       email: authUserDto.email,
    //       password: pass,
    //       salt: salt,
    //       iv: iv,
    //       token: undefined
    //     };
    //
    //     resolve(user);
    //   } catch (err) {
    //     reject(err);
    //   }
    // });


    //   crypto.pbkdf2(authUserDto.password, salt, iterations, keyLength, 'sha512', (err: any, derivedKey: any) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //
    //       const user: User = {
    //         id: undefined,
    //         email: authUserDto.email,
    //         password: derivedKey,
    //         salt: salt,
    //         iv: iv,
    //         token: undefined
    //       };
    //
    //       resolve(user);
    //     }
    //   });
    // });
  // }

  // encryptPassword(passwordEntry: PasswordEntryDecryptedDto, key: Uint8Array): PasswordentryEncryptedDto {
  //   const cipher = crypto.createCipheriv('aes-256-cbc', key, passwordEntry.iv);
  //   let encryptedPassword = cipher.update(Buffer.concat([passwordEntry.salt, Buffer.from(passwordEntry.decryptedPassword)]));
  //
  //   encryptedPassword = Buffer.concat([encryptedPassword, cipher.final()]);
  //
  //   return {
  //     id: undefined,
  //     userid: passwordEntry.userid,
  //     encryptedPassword: encryptedPassword,
  //     salt: passwordEntry.salt,
  //     iv: passwordEntry.iv
  //   };
  // }
  // decryptPassword(passwordEntry: PasswordentryEncryptedDto, key: Buffer): PasswordEntryDecryptedDto {
  //   const decipher = crypto.createDecipheriv('aes-256-cbc', key, passwordEntry.iv);
  //   let decryptedPassword = decipher.update(Buffer.concat([passwordEntry.encryptedPassword]));
  //
  //   decryptedPassword = Buffer.concat([decryptedPassword, decipher.final()]);
  //
  //   return {
  //     id: undefined,
  //     userid: passwordEntry.userid,
  //     decryptedPassword: decryptedPassword.toString().slice(16), // Remove salt
  //     salt: passwordEntry.salt,
  //     iv: passwordEntry.iv
  //   };
  // }
}
