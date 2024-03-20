import {Injectable} from '@angular/core';
import {AuthUserDto} from "./dtos/authuser.dto";
import {environment} from "../../environments/environment.development";
import CryptoJS from 'crypto-js';
import {RegisterUserDto} from "./dtos/RegisterUserDto";
import {PasswordEntryDto} from "./dtos/passwordEntryDto";
import generator from 'generate-password-ts';

let keyLength = environment.keyLength;
let iterations = environment.iterAuth;

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }
  async createUser(authUserDto: AuthUserDto): Promise<RegisterUserDto> {
    let salt = CryptoJS.lib.WordArray.random(16);

    let key = CryptoJS.PBKDF2(authUserDto.password, salt,
      { keySize: keyLength / 32, iterations: iterations});

    return {
      email: authUserDto.email,
      password: CryptoJS.enc.Base64.stringify(key),
      salt: CryptoJS.enc.Base64.stringify(salt),
    };
  }

  async createKey(password: string, salt: string, iter: number): Promise<string> {
    let slt = CryptoJS.enc.Base64.parse(salt);
    let key = CryptoJS.PBKDF2(password, slt,
      { keySize: keyLength / 32, iterations: iter});

    return CryptoJS.enc.Base64.stringify(key);
  }

  async encrypt(data: string, key: string): Promise<PasswordEntryDto> {
    let encrypted = CryptoJS.AES.encrypt(data, key, {mode: CryptoJS.mode.CBC});

    return {
      id: undefined,
      userid: '',
      name: '',
      plain: '',
      salt: CryptoJS.enc.Base64.stringify(encrypted.salt),
      iv: CryptoJS.enc.Base64.stringify(encrypted.iv),
      password: CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    };
  }

  async decrypt(passwordEntry: PasswordEntryDto, key: string): Promise<string> {

    let params = CryptoJS.lib.CipherParams.create({
      key: CryptoJS.enc.Base64.parse(key),
      ciphertext: CryptoJS.enc.Base64.parse(passwordEntry.password),
      salt: CryptoJS.enc.Base64.parse(passwordEntry.salt),
      iv: CryptoJS.enc.Base64.parse(passwordEntry.iv)
    });

    let decrypted = CryptoJS.AES.decrypt(params, key);

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generatePassword() {
    return generator.generate({
      length: 20,
      numbers: true,
      symbols: true,
      uppercase: true,
      strict: true
    });
  }
}
