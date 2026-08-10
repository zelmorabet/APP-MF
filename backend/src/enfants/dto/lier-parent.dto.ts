import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { RelationParent } from '@prisma/client';

export class LierParentDto {
  @IsString() parentId: string;
  @IsEnum(RelationParent) relation: RelationParent;
  @IsOptional() @IsBoolean() estCustodial?: boolean;
}
