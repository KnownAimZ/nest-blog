import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: "User's name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "User's email" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password" })
  @MinLength(8)
  @IsString()
  password: string;
}
