export interface PasswordEntryDecryptedDto {
  id: string | undefined;
  name: string;
  userid: string;
  password: string;
  salt: string;
  iv: string;
}
