import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ description: "User's id" })
  @IsNumber()
  id: number;
}
