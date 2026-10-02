const { describe, it } = require("node:test");
const assert = require("node:assert");

const { md5, sha256 } = require("../lib/hash.js");

describe("hash.js", function () {
  it("md5, string", function () {
    assert.equal(md5("hello"), "5d41402abc4b2a76b9719d911017c592");
  });

  it("md5, buffer equals string", function () {
    assert.equal(md5(Buffer.from("hello")), md5("hello"));
  });

  it("md5, base64", function () {
    assert.equal(md5("hello", "base64"), "XUFAKrxLKna5cZ2REBfFkg==");
  });

  it("sha256, string", function () {
    assert.equal(
      sha256("hello"),
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });

  it("sha256, base64url", function () {
    assert.equal(
      sha256("hello", "base64url"),
      "LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ"
    );
  });

  it("sha256, empty string", function () {
    assert.equal(
      sha256(""),
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });
});
