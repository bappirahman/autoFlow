import { credential } from '@/db/schema';
import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { decrypt, encrypt } from '@/common/utils/encrypt';
import { CreateCredentialDto } from '@/modules/credentials/dto/create-credential.dto';
import { UpdateCredentialDto } from '@/modules/credentials/dto/update-credential.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, desc, eq, ilike } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/db/schema';

type DrizzleDb = NodePgDatabase<typeof schema>;

const MASKED_VALUE = '••••••••';

@Injectable()
export class CredentialsRepository {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN) private readonly db: DrizzleDb,
  ) {}

  async create(userId: string, dto: CreateCredentialDto) {
    const result = await this.db
      .insert(credential)
      .values({
        userId,
        name: dto.name!,
        value: encrypt(dto.value!),
        type: dto.type!,
      })
      .returning()
      .then((res) => res[0]);
    return { ...result, value: MASKED_VALUE };
  }

  async findMany(
    userId: string,
    {
      page,
      pageSize,
      search,
    }: { page: number; pageSize: number; search?: string },
  ) {
    const filters = and(
      eq(credential.userId, userId),
      ...(search ? [ilike(credential.name, `%${search}%`)] : []),
    );

    const [items, totalCount] = await Promise.all([
      this.db.query.credential.findMany({
        where: filters,
        orderBy: [desc(credential.updatedAt)],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      this.db
        .select({ count: count() })
        .from(credential)
        .where(filters)
        .then((res) => res[0]?.count ?? 0),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: items.map((c) => ({ ...c, value: MASKED_VALUE })),
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      page,
      pageSize,
    };
  }

  async findById(id: string, userId: string) {
    const result = await this.db.query.credential.findFirst({
      where: and(eq(credential.id, id), eq(credential.userId, userId)),
    });
    if (!result) throw new NotFoundException('Credential not found');
    return { ...result, value: MASKED_VALUE };
  }

  async findByIdDecrypted(id: string, userId: string) {
    const result = await this.db.query.credential.findFirst({
      where: and(eq(credential.id, id), eq(credential.userId, userId)),
    });
    if (!result) throw new NotFoundException('Credential not found');
    return { ...result, value: decrypt(result.value) };
  }

  async update(id: string, userId: string, dto: UpdateCredentialDto) {
    await this.findById(id, userId);
    const result = await this.db
      .update(credential)
      .set({
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.value !== undefined && { value: encrypt(dto.value) }),
        ...(dto.type !== undefined && { type: dto.type }),
      })
      .where(and(eq(credential.id, id), eq(credential.userId, userId)))
      .returning()
      .then((res) => res[0]);
    return { ...result, value: MASKED_VALUE };
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.db
      .delete(credential)
      .where(and(eq(credential.id, id), eq(credential.userId, userId)))
      .returning();
  }
}
