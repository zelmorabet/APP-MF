import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEvenementDto } from './dto/create-evenement.dto';
export declare class CalendrierService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(debut?: Date, fin?: Date): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }[]>;
    create(dto: CreateEvenementDto): import(".prisma/client").Prisma.Prisma__CalendrierEvenementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: Partial<CreateEvenementDto>): import(".prisma/client").Prisma.Prisma__CalendrierEvenementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__CalendrierEvenementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    importerFeriesQuebec(): Promise<PromiseSettledResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }>[]>;
}
