import Error "mo:base/Error";
actor {
  public func testAdd() : async () {
    if (not (1 + 1 == 2)) {
        throw Error.reject("1 + 1 should equal 2");
    };
  };
};
