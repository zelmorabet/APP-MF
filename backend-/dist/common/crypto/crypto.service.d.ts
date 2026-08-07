import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private config;
    private readonly key;
    constructor(config: ConfigService);
    encrypt(plaintext: string): string;
    decrypt(ciphertext: string): string;
}
