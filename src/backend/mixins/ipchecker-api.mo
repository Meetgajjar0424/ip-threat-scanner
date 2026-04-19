import Types "../types/ipchecker";
import IPLib "../lib/ipchecker";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Runtime "mo:core/Runtime";

mixin (transform : OutCall.Transform, apiKey : { get : () -> Text }) {
  /// Check an IP address against AbuseIPDB (or return mock data when no API key is configured).
  /// Validates IP format first, then uses live API if key is set, otherwise returns mock.
  public func checkIP(ip : Text) : async Types.IPResult {
    if (not IPLib.isValidIP(ip)) {
      Runtime.trap("Invalid IP address format: " # ip);
    };

    let key = apiKey.get();
    if (key == "") {
      return IPLib.mockResult(ip);
    };

    let url = "https://api.abuseipdb.com/api/v2/check?ipAddress=" # ip # "&maxAgeInDays=90&verbose";
    let headers : [OutCall.Header] = [
      { name = "Key"; value = key },
      { name = "Accept"; value = "application/json" },
    ];
    let json = await OutCall.httpGetRequest(url, headers, transform);
    IPLib.parseAbuseIPDBResponse(ip, json);
  };
};
