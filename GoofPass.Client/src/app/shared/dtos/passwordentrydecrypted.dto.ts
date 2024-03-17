export interface PasswordEntryDecryptedDto {
  id: string | undefined;
  userid: string;
  decryptedPassword: string;
  salt: Uint8Array;
  iv: Uint8Array;
}
