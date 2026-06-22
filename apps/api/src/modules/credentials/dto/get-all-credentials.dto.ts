import { PAGINATION } from '@/config/constants';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetAllCredentialsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number = PAGINATION.DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(PAGINATION.MIN_PAGE_SIZE)
  @Max(PAGINATION.MAX_PAGE_SIZE)
  pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE;

  @IsString()
  @IsOptional()
  search: string = '';
}
