import { IsOptional, IsString } from 'class-validator';

export class ConnectionDto {
  @IsString()
  id!: string;

  @IsString()
  source!: string;

  @IsString()
  target!: string;

  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @IsOptional()
  @IsString()
  targetHandle?: string;
}
