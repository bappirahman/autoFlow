import { NodeType, type NodeTypeEnum } from '@autoflow/shared';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PositionDto {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}

export class NodeDto {
  @IsString()
  id!: string;

  @IsEnum(NodeType)
  type!: NodeTypeEnum;

  @ValidateNested()
  @Type(() => PositionDto)
  position!: PositionDto;

  @IsOptional()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  credentialId?: string | null;
}
