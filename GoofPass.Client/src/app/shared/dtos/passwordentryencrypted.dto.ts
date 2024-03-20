export interface PasswordentryEncryptedDto {
  id: string | undefined;
  name: string;
  userid: string;
  password: string;
  salt: string;
  iv: string;
}
