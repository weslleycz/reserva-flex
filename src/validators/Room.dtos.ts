import {
  IsString,
  IsNumber,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class UpdateRoomDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  @IsInt()
  number: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  type: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string;
}
