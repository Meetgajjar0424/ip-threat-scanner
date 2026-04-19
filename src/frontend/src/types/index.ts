export interface AuthUser {
  username: string;
  email: string;
}

export interface StoredCredential {
  email: string;
  username: string;
  passwordHash: string;
}

export interface IPResult {
  ip: string;
  isMalicious: boolean;
  confidenceScore: number;
  country: string;
  isp: string;
  threatTypes: string[];
  usageType: string;
  totalReports: number;
  lastReportedAt: string;
}

export interface CheckResult {
  ip: string;
  status: "safe" | "malicious" | "unknown";
  result: IPResult | null;
  checkedAt: string;
}

export type GlowColor = "cyan" | "green" | "red" | "purple";
