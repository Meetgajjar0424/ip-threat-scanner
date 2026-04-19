import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface IPResult {
    ip: string;
    isp: string;
    country: string;
    isMalicious: boolean;
    totalReports: bigint;
    usageType: string;
    confidenceScore: bigint;
    threatTypes: Array<string>;
    lastReportedAt: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    checkIP(ip: string): Promise<IPResult>;
    /**
     * / Set the AbuseIPDB API key (controller only).
     */
    setAPIKey(key: string): Promise<void>;
    /**
     * / Transform callback required by the IC HTTP outcalls mechanism.
     * / Sanitizes response headers before processing.
     */
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
