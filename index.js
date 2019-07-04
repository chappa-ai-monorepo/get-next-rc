const got = require('got');

const sortFn = (a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

module.exports = async (pkg, version, opts = {}, http = got) => {
  const gotOpts = { json: true };

  if (opts.username && !opts.password) {
    throw new Error('A `password` is required when an npm username is passed');
  } else if (opts.username && opts.password) {
    gotOpts.auth = `${opts.username}:${opts.password}`;
  }

  const { body: results } = await http(`https://registry.npmjs.org/${pkg}`, gotOpts);
  const versions = Object.keys(results.versions)
    .filter((v) => v.includes(version))
    .sort(sortFn);

  if (!versions.length || !versions.some((v) => v.includes('rc'))) {
    return {
      version: `${version}-rc.1`,
      publishedVersionExists: versions.some((v) => v === version),
    };
  }

  const rcRegexpr = /rc\.(\d*)/g;
  const [_, rcRaw] = rcRegexpr.exec(versions[0]);
  const nextRc = (parseInt(rcRaw, 10) || 0) + 1;

  return {
    version: `${version}-rc.${nextRc}`,
    publishedVersionExists: versions.some((v) => v === version),
  };
};
