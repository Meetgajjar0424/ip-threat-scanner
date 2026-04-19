import OutCall "mo:caffeineai-http-outcalls/outcall";
import IPCheckerMixin "mixins/ipchecker-api";

actor {
  /// The AbuseIPDB API key. Empty string means mock mode (no live calls).
  var abuseIPDBKey : Text = "";

  /// Transform callback required by the IC HTTP outcalls mechanism.
  /// Sanitizes response headers before processing.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Set the AbuseIPDB API key (controller only).
  public shared ({ caller }) func setAPIKey(key : Text) : async () {
    assert caller.isController();
    abuseIPDBKey := key;
  };

  include IPCheckerMixin(transform, object { public func get() : Text = abuseIPDBKey });
};
