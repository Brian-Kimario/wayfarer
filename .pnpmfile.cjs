function readPackage(pkg, context) {
  if (
    pkg.name === 'dtrace-provider' ||
    pkg.name === 'esbuild' ||
    pkg.name === 'odbc'
  ) {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.build = pkg.scripts.build || 'true';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
