import {Injectable} from '@angular/core';
import {AuthUserDto} from "./dtos/authuser.dto";
import {environment} from "../../environments/environment.development";
import CryptoJS from 'crypto-js';
import {RegisterUserDto} from "./dtos/RegisterUserDto";
import {PasswordentryEncryptedDto} from "./dtos/passwordentryencrypted.dto";

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

  async createKey(password: string, salt: string, iter: number): Promise<string> {
    console.log(salt);
    let slt = CryptoJS.enc.Base64.parse(salt);
    let key = CryptoJS.PBKDF2(password, slt,
      { keySize: keyLength / 32, iterations: iter});

    console.log(CryptoJS.enc.Base64.stringify(key));

    return CryptoJS.enc.Base64.stringify(key);
  }

  async encrypt(data: string, key: string): Promise<PasswordentryEncryptedDto> {
    let iv = CryptoJS.lib.WordArray.random(12);
    let salt = CryptoJS.lib.WordArray.random(16);

    let encrypted = CryptoJS.AES.encrypt(data, key, {iv: iv, salt: salt, length: environment.keyLength});

    return {
      id: undefined,
      userid: '',
      name: '',
      salt: CryptoJS.enc.Base64.stringify(salt),
      iv: CryptoJS.enc.Base64.stringify(iv),
      password: CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    };
  }

  async decrypt(passwordEntry: PasswordentryEncryptedDto, key: string): Promise<string> {
    let salt = CryptoJS.enc.Base64.parse(passwordEntry.salt);
    let iv = CryptoJS.enc.Base64.parse(passwordEntry.iv);

    let decrypted = CryptoJS.AES.decrypt(
      passwordEntry.password,
      key,
      {iv: iv, salt: salt}
    );

    return CryptoJS.enc.Utf8.stringify(decrypted);
  }
}
