-- CreateEnum
CREATE TYPE "TypeContribution" AS ENUM ('REDUIT', 'PLEIN', 'EXONERE');

-- CreateEnum
CREATE TYPE "GroupeAge" AS ENUM ('POUPON', 'BAMBIN', 'PRESCOLAIRE', 'SCOLAIRE');

-- CreateEnum
CREATE TYPE "StatutPresence" AS ENUM ('PRESENT', 'ABSENT', 'ABSENT_JUSTIFIE', 'CONGE_FERIE', 'FERMETURE');

-- CreateEnum
CREATE TYPE "StatutFeuille" AS ENUM ('BROUILLON', 'GENEREE', 'ENVOYEE_BC', 'CONFIRMEE_BC');

-- CreateEnum
CREATE TYPE "StatutEntente" AS ENUM ('BROUILLON', 'ENVOYEE_SIGNATURE', 'SIGNEE', 'EXPIREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutSignature" AS ENUM ('EN_ATTENTE', 'ENVOYE', 'SIGNE', 'REFUSE', 'EXPIRE');

-- CreateEnum
CREATE TYPE "StatutFacture" AS ENUM ('GENEREE', 'ENVOYEE', 'PAYEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "TypeDocument" AS ENUM ('ENTENTE_SERVICE', 'FEUILLE_ASSIDUITÉ', 'FACTURE', 'RECU_IMPOT', 'AUTORISATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeEvenement" AS ENUM ('FERIE', 'FERMETURE', 'FORMATION', 'CONGE', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeRapport" AS ENUM ('ASSIDUITÉ_MENSUELLE', 'INSCRIPTIONS', 'FERMETURES', 'FACTURATION_ANNUELLE');

-- CreateTable
CREATE TABLE "Rsge" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nasChiffre" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "noPermis" TEXT,
    "bureauCoordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rsge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BureauCoordinateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BureauCoordinateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "telephoneTravail" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "typeContribution" "TypeContribution" NOT NULL DEFAULT 'REDUIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enfant" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "groupeAge" "GroupeAge" NOT NULL,
    "allergies" TEXT,
    "medicaments" TEXT,
    "conditionsMedicales" TEXT,
    "nomMedecin" TEXT,
    "telephoneMedecin" TEXT,
    "nomHopital" TEXT,
    "photoUrl" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDepart" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enfant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnfantParent" (
    "enfantId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "estCustodial" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EnfantParent_pkey" PRIMARY KEY ("enfantId","parentId")
);

-- CreateTable
CREATE TABLE "ContactUrgence" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "telephone1" TEXT NOT NULL,
    "telephone2" TEXT,
    "priorite" INTEGER NOT NULL DEFAULT 1,
    "autoriseDepart" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactUrgence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presence" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "heureArrivee" TEXT,
    "heureDepart" TEXT,
    "statut" "StatutPresence" NOT NULL,
    "motifAbsence" TEXT,
    "note" TEXT,
    "feuilleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeuilleAssiduite" (
    "id" TEXT NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "statut" "StatutFeuille" NOT NULL DEFAULT 'BROUILLON',
    "pdfUrl" TEXT,
    "dateGeneration" TIMESTAMP(3),
    "dateEnvoi" TIMESTAMP(3),
    "dateConfirmBC" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeuilleAssiduite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntenteService" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "horaireType" TEXT,
    "joursPresence" TEXT,
    "heureArrivee" TEXT,
    "heureDepart" TEXT,
    "tarifJournalier" DECIMAL(8,2) NOT NULL,
    "typeContribution" "TypeContribution" NOT NULL,
    "statut" "StatutEntente" NOT NULL DEFAULT 'BROUILLON',
    "pdfUrl" TEXT,
    "signatureReqId" TEXT,
    "dateSignature" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntenteService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignatureRequete" (
    "id" TEXT NOT NULL,
    "dropboxSignId" TEXT,
    "signataire" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "statut" "StatutSignature" NOT NULL DEFAULT 'EN_ATTENTE',
    "lienSignature" TEXT,
    "dateEnvoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSignature" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignatureRequete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "nombreJours" INTEGER NOT NULL,
    "tarifJournalier" DECIMAL(8,2) NOT NULL,
    "montantBrut" DECIMAL(10,2) NOT NULL,
    "montantSubvention" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "montantNet" DECIMAL(10,2) NOT NULL,
    "statut" "StatutFacture" NOT NULL DEFAULT 'GENEREE',
    "pdfUrl" TEXT,
    "dateEnvoi" TIMESTAMP(3),
    "datePaiement" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subvention" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "reference" TEXT,

    CONSTRAINT "Subvention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeDocument" NOT NULL,
    "url" TEXT NOT NULL,
    "taille" INTEGER,
    "parentId" TEXT,
    "enfantId" TEXT,
    "signatureReqId" TEXT,
    "estSigne" BOOLEAN NOT NULL DEFAULT false,
    "dateEnvoi" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendrierEvenement" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeEvenement" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "touteJournee" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "couleur" TEXT DEFAULT '#3b82f6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendrierEvenement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rapport" (
    "id" TEXT NOT NULL,
    "type" "TypeRapport" NOT NULL,
    "mois" INTEGER,
    "annee" INTEGER NOT NULL,
    "pdfUrl" TEXT,
    "excelUrl" TEXT,
    "bcId" TEXT,
    "dateGeneration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEnvoi" TIMESTAMP(3),

    CONSTRAINT "Rapport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rsge_email_key" ON "Rsge"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Presence_enfantId_date_key" ON "Presence"("enfantId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FeuilleAssiduite_mois_annee_key" ON "FeuilleAssiduite"("mois", "annee");

-- CreateIndex
CREATE UNIQUE INDEX "EntenteService_signatureReqId_key" ON "EntenteService"("signatureReqId");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureRequete_dropboxSignId_key" ON "SignatureRequete"("dropboxSignId");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_parentId_mois_annee_key" ON "Facture"("parentId", "mois", "annee");

-- CreateIndex
CREATE UNIQUE INDEX "Document_signatureReqId_key" ON "Document"("signatureReqId");

-- AddForeignKey
ALTER TABLE "Rsge" ADD CONSTRAINT "Rsge_bureauCoordId_fkey" FOREIGN KEY ("bureauCoordId") REFERENCES "BureauCoordinateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnfantParent" ADD CONSTRAINT "EnfantParent_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnfantParent" ADD CONSTRAINT "EnfantParent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactUrgence" ADD CONSTRAINT "ContactUrgence_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_feuilleId_fkey" FOREIGN KEY ("feuilleId") REFERENCES "FeuilleAssiduite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntenteService" ADD CONSTRAINT "EntenteService_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntenteService" ADD CONSTRAINT "EntenteService_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntenteService" ADD CONSTRAINT "EntenteService_signatureReqId_fkey" FOREIGN KEY ("signatureReqId") REFERENCES "SignatureRequete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subvention" ADD CONSTRAINT "Subvention_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_signatureReqId_fkey" FOREIGN KEY ("signatureReqId") REFERENCES "SignatureRequete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_bcId_fkey" FOREIGN KEY ("bcId") REFERENCES "BureauCoordinateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
