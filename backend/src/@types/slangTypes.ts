import { ParsedQs } from "qs";

export interface RequestSlangType extends ParsedQs {
  requestedTerm: string;
}

export interface SlangResponse {
  term: string;
  definition: string;
  context: string;
  origin: string;
  likes: number;
  id: number;
  submittedBy: string;
  isEnforcer?: "ENFORCER" | "USER";
}

export interface PostSlangType {
  term: string;
  definition: string;
  context: string;
  origin?: string;
}

