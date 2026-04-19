import Types "../types/ipchecker";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  // ─── Internal Helpers ───────────────────────────────────────────────

  func charToDigit(c : Char) : ?Nat {
    switch (c) {
      case '0' ?0; case '1' ?1; case '2' ?2; case '3' ?3; case '4' ?4;
      case '5' ?5; case '6' ?6; case '7' ?7; case '8' ?8; case '9' ?9;
      case _ null;
    };
  };

  func parseNat(s : Text) : ?Nat {
    if (s == "") return null;
    var result : Nat = 0;
    var valid = true;
    for (c in s.chars()) {
      switch (charToDigit(c)) {
        case (?d) { result := result * 10 + d };
        case null { valid := false };
      };
    };
    if (valid) ?result else null;
  };

  func textToNat(s : Text) : Nat {
    switch (parseNat(s.trim(#char ' '))) {
      case (?n) n;
      case null 0;
    };
  };

  // ─── IP Validation ──────────────────────────────────────────────────

  func isIPv4(ip : Text) : Bool {
    let parts = ip.split(#char '.');
    var count = 0;
    var valid = true;
    for (part in parts) {
      count += 1;
      if (count > 4 or part == "") { valid := false };
      switch (parseNat(part)) {
        case (?n) { if (n > 255) { valid := false } };
        case null { valid := false };
      };
    };
    valid and count == 4;
  };

  func isIPv6(ip : Text) : Bool {
    if (not ip.contains(#char ':')) return false;
    var valid = true;
    for (c in ip.chars()) {
      let ok = (c >= '0' and c <= '9') or (c >= 'a' and c <= 'f') or
               (c >= 'A' and c <= 'F') or c == ':';
      if (not ok) { valid := false };
    };
    valid;
  };

  /// Validate that the given text is a valid IPv4 or IPv6 address format.
  public func isValidIP(ip : Text) : Bool {
    let trimmed = ip.trim(#char ' ');
    if (trimmed == "") return false;
    isIPv4(trimmed) or isIPv6(trimmed);
  };

  // ─── Private IP Detection ───────────────────────────────────────────

  /// Detect RFC 1918 / loopback / link-local IP ranges.
  public func isPrivateIP(ip : Text) : Bool {
    // Loopback
    if (ip.startsWith(#text "127.")) return true;
    // RFC 1918: 10.x.x.x
    if (ip.startsWith(#text "10.")) return true;
    // RFC 1918: 192.168.x.x
    if (ip.startsWith(#text "192.168.")) return true;
    // RFC 1918: 172.16.x.x – 172.31.x.x
    if (ip.startsWith(#text "172.")) {
      var idx = 0;
      for (part in ip.split(#char '.')) {
        if (idx == 1) {
          switch (parseNat(part)) {
            case (?n) { if (n >= 16 and n <= 31) return true };
            case null {};
          };
        };
        idx += 1;
      };
    };
    // IPv6 loopback and link-local
    if (ip == "::1") return true;
    if (ip.startsWith(#text "fe80:") or ip.startsWith(#text "FE80:")) return true;
    false;
  };

  // ─── Mock Result ────────────────────────────────────────────────────

  /// Build a mock IPResult. Private IPs always return safe.
  /// Other IPs derive pseudo-random risk from the last octet.
  public func mockResult(ip : Text) : Types.IPResult {
    if (isPrivateIP(ip)) {
      return {
        ip;
        isMalicious = false;
        confidenceScore = 0;
        country = "Private";
        isp = "Private Network";
        threatTypes = [];
        usageType = "Private";
        totalReports = 0;
        lastReportedAt = "";
      };
    };

    // Extract last octet for deterministic mock variation
    var lastOctet : Nat = 0;
    var idx = 0;
    for (part in ip.split(#char '.')) {
      if (idx == 3) {
        switch (parseNat(part)) {
          case (?n) { lastOctet := n };
          case null {};
        };
      };
      idx += 1;
    };

    let score = (lastOctet * 37) % 100;
    let reports = (lastOctet * 13) % 50;
    let malicious = score > 25 or reports > 5;

    let threats : [Text] = if (malicious) {
      if (score > 70) ["SSH Brute-Force", "Port Scan"]
      else if (score > 40) ["Port Scan"]
      else ["Spam"]
    } else { [] };

    {
      ip;
      isMalicious = malicious;
      confidenceScore = score;
      country = "US";
      isp = "Mock ISP Inc.";
      threatTypes = threats;
      usageType = if (malicious) "Data Center/Web Hosting/Transit" else "Fixed Line ISP";
      totalReports = reports;
      lastReportedAt = if (reports > 0) "2026-04-01T00:00:00+00:00" else "";
    };
  };

  // ─── JSON Parsing ───────────────────────────────────────────────────

  /// Extract the value of a named JSON field from a flat JSON string.
  /// Handles string values (quoted) and primitive values (number/bool/null).
  func extractField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\":";
    let parts = json.split(#text needle);
    var first = true;
    for (chunk in parts) {
      if (first) { first := false }
      else {
        let t = chunk.trim(#char ' ');
        if (t.startsWith(#text "\"")) {
          // String value: read until the next unescaped quote
          var value = "";
          var afterOpen = false;
          var done = false;
          for (c in t.chars()) {
            if (done) {
              // skip
            } else if (not afterOpen) {
              if (c == '\"') { afterOpen := true };
            } else {
              if (c == '\"') { done := true }
              else { value := value # Text.fromChar(c) };
            };
          };
          return ?value;
        } else {
          // Primitive value: read until delimiter
          var value = "";
          for (c in t.chars()) {
            if (c != ',' and c != '}' and c != ' ' and c != '\n' and c != '\r') {
              value := value # Text.fromChar(c);
            };
          };
          return ?value;
        };
      };
    };
    null;
  };

  /// Parse AbuseIPDB JSON response text into an IPResult.
  public func parseAbuseIPDBResponse(ip : Text, json : Text) : Types.IPResult {
    let score = textToNat(switch (extractField(json, "abuseConfidenceScore")) { case (?v) v; case null "0" });
    let reports = textToNat(switch (extractField(json, "totalReports")) { case (?v) v; case null "0" });
    let country = switch (extractField(json, "countryCode")) { case (?v) v; case null "" };
    let isp = switch (extractField(json, "isp")) { case (?v) v; case null "" };
    let usageType = switch (extractField(json, "usageType")) { case (?v) v; case null "" };
    let lastReportedAt = switch (extractField(json, "lastReportedAt")) { case (?v) v; case null "" };

    let malicious = score > 25 or reports > 5;
    let threats : [Text] = if (malicious and usageType != "") [usageType]
                           else if (malicious) ["Unknown Threat"]
                           else [];

    {
      ip;
      isMalicious = malicious;
      confidenceScore = score;
      country;
      isp;
      threatTypes = threats;
      usageType;
      totalReports = reports;
      lastReportedAt;
    };
  };
};
