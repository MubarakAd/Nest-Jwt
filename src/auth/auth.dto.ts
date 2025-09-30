import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpAuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class SignInAuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
