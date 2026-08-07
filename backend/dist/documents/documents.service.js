"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const prisma_service_1 = require("../common/prisma/prisma.service");
const uuid_1 = require("uuid");
let DocumentsService = class DocumentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.bucket = config.get('S3_BUCKET', 'milieu-familial');
        this.s3 = new client_s3_1.S3Client({
            endpoint: config.get('S3_ENDPOINT', ''),
            region: config.get('S3_REGION', 'us-east-1'),
            credentials: {
                accessKeyId: config.get('S3_ACCESS_KEY', ''),
                secretAccessKey: config.get('S3_SECRET_KEY', ''),
            },
            forcePathStyle: true,
        });
    }
    async upload(buffer, originalName, mimeType, type, parentId, enfantId) {
        const key = `${type.toLowerCase()}/${(0, uuid_1.v4)()}-${originalName}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
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
    async getPresignedUrl(documentId, expiresIn = 3600) {
        const doc = await this.prisma.document.findUniqueOrThrow({ where: { id: documentId } });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: doc.url }), { expiresIn });
        return { url };
    }
    findAll(parentId, enfantId) {
        return this.prisma.document.findMany({
            where: { parentId, enfantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async delete(id) {
        const doc = await this.prisma.document.findUniqueOrThrow({ where: { id } });
        await this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: doc.url }));
        return this.prisma.document.delete({ where: { id } });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map