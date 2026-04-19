module {
  /// Result of an IP threat assessment
  public type IPResult = {
    ip : Text;
    isMalicious : Bool;
    confidenceScore : Nat;
    country : Text;
    isp : Text;
    threatTypes : [Text];
    usageType : Text;
    totalReports : Nat;
    lastReportedAt : Text;
  };

  /// Error variants for IP check operations
  public type IPCheckError = {
    #InvalidIPFormat;
    #APIError : Text;
  };
};
