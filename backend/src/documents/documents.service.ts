import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../common/prisma/prisma.service';
import { TypeDocument } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.bucket = config.get('S3_BUCKET', 'milieu-familial');
    this.s3 = new S3Client({
      endpoint: config.get<string>('S3_ENDPOINT', ''),
      region: config.get<string>('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: config.get<string>('S3_ACCESS_KEY', ''),
        secretAccessKey: config.get<string>('S3_SECRET_KEY', ''),
      },
      forcePathStyle: true,
    });
  }

  async upload(buffer: Buffer, originalName: string, mimeType: string, type: TypeDocument, parentId?: string, enfantId?: string) {
    const key = `${type.toLowerCase()}/${uuidv4()}-${originalName}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }));

    return this.prisma.document.create({
      data: {
        nom: originalName,
        type,
        url: key,
        taille: buffer.length,
        parentId,
        enfantId,
      },
    });
  }

  async getPresignedUrl(documentId: string, expiresIn = 3600) {
    const doc = await this.prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: doc.url }),
      { expiresIn },
    );
    return { url };
  }

  findAll(parentId?: string, enfantId?: string) {
    return this.prisma.document.findMany({
      where: { parentId, enfantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    const doc = await this.prisma.document.findUniqueOrThrow({ where: { id } });
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: doc.url }));
    return this.prisma.document.delete({ where: { id } });
  }
}
