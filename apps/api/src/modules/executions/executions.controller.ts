import { User } from '@/common/decorators/user.decorator';
import { GetAllExecutionsDto } from '@/modules/executions/dto/get-all-executions.dto';
import { ExecutionsService } from '@/modules/executions/executions.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Get()
  async findMany(
    @User('id') userId: string,
    @Query() dto: GetAllExecutionsDto,
  ) {
    return this.executionsService.findMany(userId, dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @User('id') userId: string) {
    return this.executionsService.findById(id, userId);
  }
}
