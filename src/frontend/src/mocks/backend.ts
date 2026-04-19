import type { backendInterface } from "../backend.d";

export const mockBackend: backendInterface = {
  checkIP: async (ip: string) => ({
    ip,
    isp: "AS15169 Google LLC",
    country: "United States",
    isMalicious: false,
    totalReports: BigInt(0),
    usageType: "Data Center/Web Hosting/Transit",
    confidenceScore: BigInt(0),
    threatTypes: [],
    lastReportedAt: "",
  }),
  setAPIKey: async (_key: string) => undefined,
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
