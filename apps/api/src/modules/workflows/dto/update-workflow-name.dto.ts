import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateWorkflowNameDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
