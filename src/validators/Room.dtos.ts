import { IsString, IsNumber, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  number: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
