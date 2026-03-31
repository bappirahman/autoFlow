import { User } from '@/common/decorators/user.decorator';
import { PremiumGuard } from '@/lib/premium.guard';
import { UpdateWorkflowNameDto } from '@/modules/workflows/dto/update-workflow-name.dto';
import { WorkflowsService } from '@/modules/workflows/workflows.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowService: WorkflowsService) {}

  @Get()
  async getAllWorkflows(@User('id') userId: string) {
    return this.workflowService.getAllWorkflows(userId);
  }

  @Post()
  @UseGuards(PremiumGuard)
  async createWorkflow(@User('id') userId: string) {
    return this.workflowService.createWorkflow(userId);
  }
  @Delete(':id')
  async removeWorkflow(@Param('id') id: string, @User('id') userId: string) {
    return this.workflowService.removeWorkflow(id, userId);
  }

  @Get(':id')
  async getWorkflow(@Param('id') id: string, @User('id') userId: string) {
    return this.workflowService.getWorkflow(id, userId);
  }
  @Patch(':id')
  async updateWorkflowName(
    @Param('id') id: string,
    @Body() updateWorkflowNameDto: UpdateWorkflowNameDto,
    @User('id') userId: string,
  ) {
    return this.workflowService.updateWorkflowName(
      id,
      updateWorkflowNameDto.name,
      userId,
    );
  }
}
