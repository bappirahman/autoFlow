import { CredentialsRepository } from '@/modules/credentials/credentials.repository';
import { CreateCredentialDto } from '@/modules/credentials/dto/create-credential.dto';
import { GetAllCredentialsDto } from '@/modules/credentials/dto/get-all-credentials.dto';
import { UpdateCredentialDto } from '@/modules/credentials/dto/update-credential.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(userId: string, dto: CreateCredentialDto) {
    return this.credentialsRepository.create(userId, dto);
  }

  async findMany(userId: string, dto: GetAllCredentialsDto) {
    return this.credentialsRepository.findMany(userId, dto);
  }

  async findById(id: string, userId: string) {
    return this.credentialsRepository.findById(id, userId);
  }

  async findByIdDecrypted(id: string, userId: string) {
    return this.credentialsRepository.findByIdDecrypted(id, userId);
  }

  async update(id: string, userId: string, dto: UpdateCredentialDto) {
    return this.credentialsRepository.update(id, userId, dto);
  }

  async delete(id: string, userId: string) {
    return this.credentialsRepository.delete(id, userId);
  }
}
