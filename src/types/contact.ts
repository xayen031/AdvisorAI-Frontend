// types/contact.ts
export interface FamilyMember {
    id: number;
    name: string;
    age: number;
    relationship: string;
  }
  
  export interface PersonalDetails {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    otherDetails?: string;
  }
  
  export interface Compliance {
    idVerified?: boolean;
    lastReviewDate?: Date;
    documents?: string[];
  }
  
  export interface Financials {
    income?: string;
    expenditure?: string;
    assets?: string;
    liabilities?: string;
    emergencyFund?: string;
    investments?: string;
    protection?: string;
    retirementSavings?: string;
    estatePlanning?: string;
  }
  
  export interface FamilyInfo {
    maritalStatus?: string;
    spouse?: { name: string; age: number };
    children?: FamilyMember[];
    parents?: FamilyMember[];
    siblings?: FamilyMember[];
  }
  
  export interface RiskProfile {
    riskTolerance: string;
    investmentHorizon: string;
    investmentObjectives: string;
    appetiteForRisk?: string;
    investmentFocus?: string;
    investmentStyle?: string;
    esgInterests?: string;
  }
  
  export interface LetterOfAuthority {
    status: string;
    dateIssued: Date;
    expiryDate: Date;
  }
  
  export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
    lastContact: Date;
    address?: string;
    notes?: string;
    tags: string[];
    personalDetails?: PersonalDetails;
    compliance?: Compliance;
    financials?: Financials;
    family?: FamilyInfo;
    riskProfile: RiskProfile;
    letterOfAuthority: LetterOfAuthority;
  }
  