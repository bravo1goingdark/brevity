export interface RequestedSlang {
  term: string;
  definition: string;
  context: string;
  origin: string;
  likes: number;
  submittedBy: string;
  isEnforcer: boolean;
  id: number;
}

export interface PostSlang {
  term: string;
  definition: string;
  context: string;
  origin?: string;
}
