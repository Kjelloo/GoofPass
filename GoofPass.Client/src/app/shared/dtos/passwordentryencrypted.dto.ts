export interface PasswordentryEncryptedDto {
  id: string | undefined;
  userid: string;
  encryptedPassword: Uint8Array;
  salt: Uint8Array;
  iv: Uint8Array;
}
