import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'brazilian-class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  checkinDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  numberOfGuests: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  days: number;
}
