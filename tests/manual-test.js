import {color,catchErr} from "../dist/color.js"

console.log("\nTesting color function:");
color(
  ["Regular text"],
  ["Red text", "red"],
  ["Blue bold", "blue", "bold"],
  ["Green underline", "green", ["underline"]],
  ["Multi-style", "yellow", ["bold", "underline", "inverse"]]
);

// Test error handling
console.log("\nTesting catchErr function:");
try {
  throw new Error("This is a test error");
} catch (err) {
  catchErr(err, "/test/path");
}

// Test with non-Error
catchErr("String error", "/another/path");
catchErr({ custom: "object" }, "/object/path");