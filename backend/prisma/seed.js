"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const hash = await bcrypt.hash('Admin1234!', 12);
    const bc = await prisma.bureauCoordinateur.upsert({
        where: { id: 'bc-seed-01' },
        update: {},
        create: {
            id: 'bc-seed-01',
            nom: 'Bureau Coordinateur Test',
            email: 'bc@exemple.com',
            telephone: '514-555-0100',
            adresse: '123 rue Principale',
            ville: 'Montréal',
        },
    });
    const rsge = await prisma.rsge.upsert({
        where: { email: 'rsge@exemple.com' },
        update: {},
        create: {
            email: 'rsge@exemple.com',
            motDePasse: hash,
            prenom: 'Marie',
            nom: 'Tremblay',
            nasChiffre: 'PLACEHOLDER_ENCRYPTED',
            dateNaissance: new Date('1985-03-15'),
            telephone: '514-555-0200',
            adresse: '456 rue des Érables',
            ville: 'Montréal',
            codePostal: 'H1A 1A1',
            noPermis: 'RSG-2024-001',
            bureauCoordId: bc.id,
        },
    });
    const parent1 = await prisma.parent.upsert({
        where: { email: 'parent1@exemple.com' },
        update: {},
        create: {
            email: 'parent1@exemple.com',
            prenom: 'Jean',
            nom: 'Dupont',
            telephone: '514-555-0301',
            adresse: '789 avenue des Pins',
            ville: 'Montréal',
            codePostal: 'H2B 2B2',
            typeContribution: client_1.TypeContribution.REDUIT,
        },
    });    const parent2 = await prisma.parent.upsert({
        where: { email: 'parent2@exemple.com' },
        update: {},
        create: {
            email: 'parent2@exemple.com',
            prenom: 'Sophie',
            nom: 'Dupont',
            telephone: '514-555-0303',
            adresse: '789 avenue des Pins',
            ville: 'Montr\u00e9al',
            codePostal: 'H2B 2B2',
            typeContribution: client_1.TypeContribution.REDUIT,
        },
    });    const enfant1 = await prisma.enfant.create({
        data: {
            prenom: 'Emma',
            nom: 'Dupont',
            dateNaissance: new Date('2022-06-10'),
            groupeAge: client_1.GroupeAge.BAMBIN,
            nomMedecin: 'Dr. Lavoie',
            telephoneMedecin: '514-555-0400',
            parents: {
                create: [
                    { parentId: parent1.id, relation: 'pere', estCustodial: true },
                    { parentId: parent2.id, relation: 'mere', estCustodial: true },
                ],
            },
            contactUrgence: {
                create: {
                    prenom: 'Lucie',
                    nom: 'Martin',
                    relation: 'grand-mere',
                    telephone1: '514-555-0304',
                    autoriseDepart: true,
                },
            },
        },
    });
    console.log('Seed complété:', { bc: bc.nom, rsge: rsge.email, parents: [parent1.email, parent2.email], enfant: `${enfant1.prenom} ${enfant1.nom}` });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map