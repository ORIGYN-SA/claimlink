let upstream = https://github.com/dfinity/vessel-package-set/releases/download/mo-0.11.3-20240716/package-set.dhall sha256:a88c4889b0228ec09eeb2dd79f412f71891fb99e686efc67204b7e24378411d6
let Package =
    { name : Text, version : Text, repo : Text, dependencies : List Text }


let
  additions =
      [  { name = "cap"
  , repo = "https://github.com/stephenandrews/cap-motoko-library"
  , version = "v1.0.4-alt"
  , dependencies = [] : List Text
  },
      
  { name = "encoding"
  , repo = "https://github.com/aviate-labs/encoding.mo"
  , version = "v0.3.1"
  , dependencies = [ "array", "base" ]
  },
  { name = "array"
  , repo = "https://github.com/aviate-labs/array.mo"
  , version = "v0.1.1"
  , dependencies = [ "base" ]
  },] : List Package

in  upstream # additions