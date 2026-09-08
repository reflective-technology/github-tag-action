const path = require("path");
const fs = require("fs");

function getTarget(exports, subpath) {
  if (typeof exports === "string") {
    return subpath === "." ? exports : null;
  }

  // Nested: { ".": { "import": "..." } } or { ".": "./index.js" }
  if (exports[subpath]) {
    const entry = exports[subpath];
    if (typeof entry === "string") return entry;
    return entry.require || entry.default || entry.import || null;
  }

  // Flat: { "import": "./dist/index.js", "types": "..." }
  if (subpath === "." && (exports.import || exports.require || exports.default)) {
    return exports.require || exports.default || exports.import;
  }

  return null;
}

function resolveViaExports(request, basedir) {
  const name = request.startsWith("@")
    ? request.split("/").slice(0, 2).join("/")
    : request.split("/")[0];

  const subpath = request === name ? "." : "." + request.slice(name.length);

  let dir = basedir;
  while (true) {
    const pkgFile = path.join(dir, "node_modules", name, "package.json");
    if (fs.existsSync(pkgFile)) {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
      if (!pkg.exports) return null;

      const target = getTarget(pkg.exports, subpath);
      return target ? path.join(path.dirname(pkgFile), target) : null;
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

module.exports = (request, options) => {
  if (request.startsWith(".") || request.startsWith("/")) {
    return options.defaultResolver(request, options);
  }

  try {
    return options.defaultResolver(request, options);
  } catch (e) {
    const resolved = resolveViaExports(
      request,
      options.basedir || process.cwd(),
    );
    if (resolved) return resolved;
    throw e;
  }
};