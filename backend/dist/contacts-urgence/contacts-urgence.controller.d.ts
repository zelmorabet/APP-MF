import { ContactsUrgenceService } from './contacts-urgence.service';
import { CreateContactUrgenceDto } from './dto/create-contact.dto';
export declare class ContactsUrgenceController {
    private service;
    constructor(service: ContactsUrgenceService);
    findByEnfant(enfantId: string): import(".prisma/client").Prisma.Prisma__ContactUrgenceClient<{
        id: string;
        prenom: string;
        nom: string;
        enfantId: string;
        relation: string;
        telephone1: string;
        telephone2: string | null;
        autoriseDepart: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateContactUrgenceDto): Promise<{
        id: string;
        prenom: string;
        nom: string;
        enfantId: string;
        relation: string;
        telephone1: string;
        telephone2: string | null;
        autoriseDepart: boolean;
    }>;
    update(id: string, dto: Partial<CreateContactUrgenceDto>): Promise<{
        id: string;
        prenom: string;
        nom: string;
        enfantId: string;
        relation: string;
        telephone1: string;
        telephone2: string | null;
        autoriseDepart: boolean;
    }>;
    delete(id: string): Promise<{
        id: string;
        prenom: string;
        nom: string;
        enfantId: string;
        relation: string;
        telephone1: string;
        telephone2: string | null;
        autoriseDepart: boolean;
    }>;
}
