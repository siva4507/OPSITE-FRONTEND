const fs = require("fs");
const path = require("path");

const enPath = path.join(__dirname, "../public/locales/en/common.json");
const esPath = path.join(__dirname, "../public/locales/es/common.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const es = JSON.parse(fs.readFileSync(esPath, "utf8"));

function findMissingKeys(base, compare, prefix = "") {
  let missing = [];

  for (const key in base) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (!(key in compare)) {
      missing.push(fullKey);
    } else if (
      typeof base[key] === "object" &&
      base[key] !== null &&
      !Array.isArray(base[key])
    ) {
      missing = missing.concat(
        findMissingKeys(base[key], compare[key], fullKey),
      );
    }
  }

  return missing;
}

const missingKeys = findMissingKeys(en, es);

if (missingKeys.length === 0) {
  console.log("✅ No missing keys in Spanish common.json");
} else {
  console.log("❌ Missing keys in Spanish common.json:");
  missingKeys.forEach((k) => console.log(" - " + k));
}
