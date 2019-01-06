const flow = require('dependency-flow');

const cwd = process.cwd();

const normalizePath = (s) => {
  let p = s.split('!');
  p = p[p.length - 1];
  return p.replace(cwd, '');
};

module.exports = function plugin() {
  const web = flow();
  return {
    generateBundle(opts, bundle) {
      const table = [];
      Object.keys(bundle).forEach((key) => {
        Object.keys(bundle[key].modules).forEach((mkey) => {
          if (mkey[0] === '\u0000') {
            return;
          }
          const m = bundle[key].modules[mkey];
          if (!m.renderedLength) {
            return;
          }
          const mInfo = this.getModuleInfo(mkey);

          mInfo.importedIds.forEach((im) => {
            if (im[0] !== '\u0000') {
              table.push([
                normalizePath(mInfo.id),
                normalizePath(im),
              ]);
            }
          });
        });
        web.update(JSON.stringify(table));
      });
    },
  };
};
