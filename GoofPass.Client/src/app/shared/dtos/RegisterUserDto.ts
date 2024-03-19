export interface RegisterUserDto {
  email: string;
  password: string | undefined;
  salt: string | undefined;
}
