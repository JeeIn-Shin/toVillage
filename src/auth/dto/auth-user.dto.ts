import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  pwd: string;
}
