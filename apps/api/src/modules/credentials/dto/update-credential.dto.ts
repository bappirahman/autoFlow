import { CredentialType, type CredentialTypeEnum } from '@/common/enums/credential-type';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCredentialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value?: string;

  @IsOptional()
  @IsEnum(CredentialType)
  type?: CredentialTypeEnum;
}
