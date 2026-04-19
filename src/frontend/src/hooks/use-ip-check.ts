import type { CheckResult, IPResult } from "@/types";
import { useCallback, useState } from "react";

const MOCK_RESULTS: Record<string, IPResult> = {
  "1.1.1.1": {
    ip: "1.1.1.1",
    isMalicious: false,
    confidenceScore: 0,
    country: "Australia",
    isp: "Cloudflare, Inc.",
    threatTypes: [],
    usageType: "Content Delivery Network",
    totalReports: 0,
    lastReportedAt: "Never",
  },
  "8.8.8.8": {
    ip: "8.8.8.8",
    isMalicious: false,
    confidenceScore: 0,
    country: "United States",
    isp: "Google LLC",
    threatTypes: [],
    usageType: "Search Engine Spider",
    totalReports: 0,
    lastReportedAt: "Never",
  },
  "185.220.101.1": {
    ip: "185.220.101.1",
    isMalicious: true,
    confidenceScore: 97,
    country: "Germany",
    isp: "Tor Exit Node",
    threatTypes: ["Tor Exit Node", "Data Exfiltration", "Hacking"],
    usageType: "Tor Anonymizer",
    totalReports: 843,
    lastReportedAt: "2026-04-18T22:41:00Z",
  },
  "192.168.1.1": {
    ip: "192.168.1.1",
    isMalicious: false,
    confidenceScore: 0,
    country: "Private Network",
    isp: "Local Network",
    threatTypes: [],
    usageType: "Private Network",
    totalReports: 0,
    lastReportedAt: "Never",
  },
};

function getMockResult(ip: string): IPResult {
  if (MOCK_RESULTS[ip]) return MOCK_RESULTS[ip];
  // Generate semi-deterministic result based on IP
  const parts = ip.split(".").map(Number);
  const seed =
    (parts[0] ?? 0) + (parts[1] ?? 0) + (parts[2] ?? 0) + (parts[3] ?? 0);
  const isMalicious = seed % 3 === 0;
  return {
    ip,
    isMalicious,
    confidenceScore: isMalicious ? Math.min(99, (seed * 7) % 100) : 0,
    country:
      ["United States", "Germany", "Netherlands", "China", "Russia"][
        seed % 5
      ] ?? "Unknown",
    isp:
      [
        "AS-CHOOPA",
        "Hetzner Online GmbH",
        "DataCenter Group",
        "Alibaba Cloud",
        "PJSC Rostelecom",
      ][seed % 5] ?? "Unknown",
    threatTypes: isMalicious
      ? ([
          ["SSH Brute-Force", "Port Scan", "DDoS"],
          ["Phishing", "Malware Distribution"],
          ["SQL Injection", "Web App Attack"],
        ][seed % 3] ?? [])
      : [],
    usageType: isMalicious ? "Data Center/Web Hosting" : "ISP",
    totalReports: isMalicious ? (seed * 13) % 500 : 0,
    lastReportedAt: isMalicious ? "2026-04-17T14:23:00Z" : "Never",
  };
}

function isValidIP(ip: string): boolean {
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]{2,39}$/;
  if (v4.test(ip)) {
    return ip.split(".").every((oct) => {
      const n = Number.parseInt(oct, 10);
      return n >= 0 && n <= 255;
    });
  }
  return v6.test(ip);
}

export function useIPCheck() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIP = useCallback(async (ip: string) => {
    const trimmed = ip.trim();
    if (!trimmed) {
      setError("Please enter an IP address");
      return;
    }
    if (!isValidIP(trimmed)) {
      setError("Invalid IP address format");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Simulate network latency for mock mode
    await new Promise((r) => setTimeout(r, 1200));

    const ipResult = getMockResult(trimmed);
    setResult({
      ip: trimmed,
      status: ipResult.isMalicious ? "malicious" : "safe",
      result: ipResult,
      checkedAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, checkIP, reset };
}
