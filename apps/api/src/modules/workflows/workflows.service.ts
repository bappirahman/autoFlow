import { WorkflowsRepository } from '@/modules/workflows/workflows.repository';
import { inngest } from '@/lib/inngest/client';
import { GetAllWorkflowsDto } from '@/modules/workflows/dto/get-all-workflows.dto';
import { UpdateWorkflowNameDto } from '@/modules/workflows/dto/update-workflow-name.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowsService {
  private readonly workflowsRepository = new WorkflowsRepository();

  async createWorkflow(userId: string) {
    return this.workflowsRepository.create(userId);
  }

  async getOneWorkflow(id: string, userId: string) {
    return this.workflowsRepository.findById(id, userId);
  }

  async getAllWorkflows(
    userId: string,
    getAllWorkflowsDto: GetAllWorkflowsDto,
  ) {
    return this.workflowsRepository.findMany(userId, getAllWorkflowsDto);
  }

  async updateWorkflow(
    id: string,
    payload: UpdateWorkflowNameDto,
    userId: string,
  ) {
    return this.workflowsRepository.update(id, userId, payload);
  }

  async executeWorkflow(workflowId: string, userId: string) {
    const { ids } = await inngest.send({
      name: 'workflows/execute.workflow',
      data: { workflowId, userId },
    });

    return await this.workflowsRepository.createExecution(workflowId, ids[0]);
  }

  async removeWorkflow(id: string, userId: string) {
    return this.workflowsRepository.delete(id, userId);
  }
}
