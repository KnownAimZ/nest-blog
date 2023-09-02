import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ description: "User's verificationLink" })
  @IsUUID(4)
  verificationLink: string;
}
