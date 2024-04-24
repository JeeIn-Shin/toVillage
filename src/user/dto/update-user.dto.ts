import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  pwd: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  profileImg: string;
}
