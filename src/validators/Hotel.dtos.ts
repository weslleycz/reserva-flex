import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHotelDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  amenities: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ApiPropertyOptional()
  @IsOptional()
  imagens: string[];
}

export class UpdateHotelDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  location: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  amenities: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  imagens: string[];
}
