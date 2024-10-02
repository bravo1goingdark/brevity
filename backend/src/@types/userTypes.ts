import {ParsedQs} from "qs"

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Login {
  username?: string;
  email?: string;
  password: string;
}
export interface Delete {
  email: string;
  password: string;
}

export interface Update {
  email?: string;
  username?: string;
  password?: string;
}

export interface mailOption {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// need to extend ParsedQs interface to dynamically attach token property to avoid Error TS-2769
export interface QueryVerificationToken extends ParsedQs {
  token: string;
}
export interface ResetPasswordRequest {
  email: string;
}
export interface ResetPassword {
  newPassword: string;
}

export interface ResponseSkeleton {
  msg: string | string[];
}
