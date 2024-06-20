import { IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  hashedPwd: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @Matches(/^\/src\//, { message: 'profileImg must start with "/src/"' })
  profileImg: string;

  @IsOptional()
  @IsString()
  currentHashedRefreshToken: string;
}
