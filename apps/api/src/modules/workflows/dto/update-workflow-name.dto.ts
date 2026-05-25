import { ConnectionDto } from '@/modules/workflows/dto/connection.dto';
import { NodeDto } from '@/modules/workflows/dto/node.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateWorkflowNameDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes?: NodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectionDto)
  edges?: ConnectionDto[];
}
