import { IsString, IsOptional, MaxLength, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  datetime?: string;
}

