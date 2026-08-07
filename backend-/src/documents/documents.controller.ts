import { Controller, Get, Post, Delete, Param, Query, UploadedFile, UseInterceptors, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TypeDocument } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  findAll(@Query('parentId') parentId?: string, @Query('enfantId') enfantId?: string) {
    return this.service.findAll(parentId, enfantId);
  }

  @Get(':id/url')
  getUrl(@Param('id') id: string) {
    return this.service.getPresignedUrl(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('fichier', { limits: { fileSize: 10 * 1024 * 1024 } }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: TypeDocument,
    @Body('parentId') parentId?: string,
    @Body('enfantId') enfantId?: string,
  ) {
    return this.service.upload(file.buffer, file.originalname, file.mimetype, type, parentId, enfantId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
