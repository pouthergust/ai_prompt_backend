import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(160)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;
}