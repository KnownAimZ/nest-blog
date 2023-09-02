import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestPasswordResubmitDto {
  @ApiProperty({ description: "User's email" })
  @IsEmail()
  email: string;
}
