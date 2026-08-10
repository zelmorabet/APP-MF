export type GroupeAge = 'POUPON' | 'BAMBIN' | 'PRESCOLAIRE' | 'SCOLAIRE';
export type TypeContribution = 'REDUIT' | 'PLEIN' | 'EXONERE';
export type RelationParent = 'MERE' | 'PERE' | 'TUTEUR' | 'GRAND_PARENT' | 'AUTRE';
export type StatutPresence = 'PRESENT' | 'ABSENT' | 'ABSENT_JUSTIFIE' | 'CONGE_FERIE' | 'FERMETURE';
export type StatutEntente = 'BROUILLON' | 'ENVOYEE_SIGNATURE' | 'SIGNEE' | 'EXPIREE' | 'ANNULEE';
export type StatutFeuille = 'BROUILLON' | 'GENEREE' | 'ENVOYEE_BC' | 'CONFIRMEE_BC';
export type StatutFacture = 'GENEREE' | 'ENVOYEE' | 'PAYEE' | 'ANNULEE';
export type TypeEvenement = 'FERIE' | 'FERMETURE' | 'FORMATION' | 'CONGE' | 'AUTRE';

export interface Rsge {
  id: string; email: string; prenom: string; nom: string;
  telephone?: string; adresse?: string; ville?: string; noPermis?: string;
  bureauCoord?: BureauCoordinateur;
}

export interface BureauCoordinateur {
  id: string; nom: string; email: string; telephone?: string;
}

export interface Parent {
  id: string; email: string; prenom: string; nom: string;
  telephone?: string; adresse?: string; ville?: string;
  typeContribution: TypeContribution;
  enfants?: EnfantParent[];
}

export interface Enfant {
  id: string; prenom: string; nom: string;
  dateNaissance: string; groupeAge: GroupeAge;
  allergies?: string; medicaments?: string; conditionsMedicales?: string;
  nomMedecin?: string; telephoneMedecin?: string;
  actif: boolean; dateInscription: string;
  parents?: EnfantParent[];
  contactsUrgence?: ContactUrgence[];
}

export interface EnfantParent {
  enfantId: string; parentId: string; relation: RelationParent;
  estCustodial: boolean;
  enfant?: Enfant; parent?: Parent;
}

export const RELATION_PARENT_LABELS: Record<RelationParent, string> = {
  MERE: 'Mère',
  PERE: 'Père',
  TUTEUR: 'Tuteur/Tutrice légal(e)',
  GRAND_PARENT: 'Grand-parent',
  AUTRE: 'Autre',
};

export interface ContactUrgence {
  id: string; enfantId: string; prenom: string; nom: string;
  relation: string; telephone1: string; telephone2?: string;
  priorite: number; autoriseDepart: boolean;
}

export interface Presence {
  id: string; enfantId: string; date: string;
  statut: StatutPresence; heureArrivee?: string; heureDepart?: string;
  motifAbsence?: string; note?: string;
  enfant?: Enfant;
}

export interface FeuilleAssiduite {
  id: string; mois: number; annee: number;
  statut: StatutFeuille; pdfUrl?: string;
  dateGeneration?: string; dateEnvoi?: string; dateConfirmBC?: string;
}

export interface EntenteService {
  id: string; parentId: string; enfantId: string;
  version: number; dateDebut: string; dateFin?: string;
  tarifJournalier: number; typeContribution: TypeContribution;
  statut: StatutEntente; pdfUrl?: string; dateSignature?: string;
  parent?: Parent; enfant?: Enfant;
  signatureRequete?: { statut: string; lienSignature?: string };
}

export interface Facture {
  id: string; parentId: string; mois: number; annee: number;
  nombreJours: number; tarifJournalier: number;
  montantBrut: number; montantSubvention: number; montantNet: number;
  statut: StatutFacture; dateEnvoi?: string;
  parent?: Parent;
}

export interface CalendrierEvenement {
  id: string; titre: string; type: TypeEvenement;
  dateDebut: string; dateFin?: string;
  touteJournee: boolean; description?: string; couleur?: string;
}

export interface Dashboard {
  nbEnfants: number; nbParents: number;
  nbEntentesPending: number; nbPresencesAuj: number;
}

export const GROUPE_AGE_LABELS: Record<GroupeAge, string> = {
  POUPON: 'Poupon (0-18 mois)', BAMBIN: 'Bambin (18m-3 ans)',
  PRESCOLAIRE: 'Préscolaire (3-5 ans)', SCOLAIRE: 'Scolaire (5 ans+)',
};

export const STATUT_PRESENCE_LABELS: Record<StatutPresence, string> = {
  PRESENT: 'Présent', ABSENT: 'Absent', ABSENT_JUSTIFIE: 'Absent justifié',
  CONGE_FERIE: 'Congé / Férié', FERMETURE: 'Fermeture',
};

export const STATUT_ENTENTE_LABELS: Record<StatutEntente, string> = {
  BROUILLON: 'Brouillon', ENVOYEE_SIGNATURE: 'En attente de signature',
  SIGNEE: 'Signée', EXPIREE: 'Expirée', ANNULEE: 'Annulée',
};

export const MOIS_LABELS = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
