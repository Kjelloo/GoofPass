export interface User {
  id: string | undefined;
  username: string;
  password: Uint8Array;
  salt: Uint8Array;
  iv: Uint8Array;
}
