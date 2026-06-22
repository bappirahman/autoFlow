import {
  CredentialType,
  type CredentialTypeEnum,
} from '@/common/enums/credential-type';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  value?: string;

  @IsEnum(CredentialType)
  type?: CredentialTypeEnum;
}
