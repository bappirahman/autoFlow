import { ExecutionsRepository } from '@/modules/executions/executions.repository';
import { GetAllExecutionsDto } from '@/modules/executions/dto/get-all-executions.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecutionsService {
  constructor(private readonly executionsRepository: ExecutionsRepository) {}

  async findMany(userId: string, dto: GetAllExecutionsDto) {
    return this.executionsRepository.findMany(userId, dto);
  }

  async findById(id: string, userId: string) {
    return this.executionsRepository.findById(id, userId);
  }
}
