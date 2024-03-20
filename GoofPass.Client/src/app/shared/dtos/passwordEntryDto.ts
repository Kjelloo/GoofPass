export interface PasswordEntryDto {
  id: string | undefined;
  name: string;
  userid: string;
  password: string;
  plain: string;
  salt: string;
  iv: string;
}
