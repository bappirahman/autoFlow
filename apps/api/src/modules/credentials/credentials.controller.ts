import { User } from '@/common/decorators/user.decorator';
import { PremiumGuard } from '@/lib/premium.guard';
import { CreateCredentialDto } from '@/modules/credentials/dto/create-credential.dto';
import { GetAllCredentialsDto } from '@/modules/credentials/dto/get-all-credentials.dto';
import { UpdateCredentialDto } from '@/modules/credentials/dto/update-credential.dto';
import { CredentialsService } from '@/modules/credentials/credentials.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Get()
  async getAll(@User('id') userId: string, @Query() dto: GetAllCredentialsDto) {
    return this.credentialsService.findMany(userId, dto);
  }

  @Post()
  @UseGuards(PremiumGuard)
  async create(@User('id') userId: string, @Body() dto: CreateCredentialDto) {
    return this.credentialsService.create(userId, dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @User('id') userId: string) {
    return this.credentialsService.findById(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() dto: UpdateCredentialDto,
  ) {
    return this.credentialsService.update(id, userId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.credentialsService.delete(id, userId);
  }
}
