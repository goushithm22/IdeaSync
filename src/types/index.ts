
export type UserRole = "investor" | "founder";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  sector: string;
  founderId: string;
  fundingGoal?: number;
  pitchDeck?: string;
  contactDetails?: string;
}
