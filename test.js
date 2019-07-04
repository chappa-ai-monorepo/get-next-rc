const test = require('tape');

const getNextRC = require('./index');

test('Should throw an error when username is present but password is not', async (t) => {
  t.plan(1);

  try {
    await getNextRC(`@chappa'ai/get-next-rc`, '1.0.0', { username: 'Renddslow' });
  } catch (e) {
    t.pass();
  }

  t.end();
});

test('Should fetch package when no username or password is present with no auth field', async (t) => {
  t.plan(1);

  const httpInterface = (url, opts) =>
    new Promise((resolve) => {
      t.deepEqual(opts, { json: true });
      return resolve({
        body: {
          versions: {},
        },
      });
    });

  await getNextRC(`@chappa'ai/get-next-rc`, '1.0.0', {}, httpInterface);

  t.end();
});

test('Should fetch package with auth when username and password are both present', async (t) => {
  t.plan(1);

  const httpInterface = (url, opts) =>
    new Promise((resolve) => {
      t.deepEqual(opts, { json: true, auth: 'Renddslow:123' });
      return resolve({
        body: {
          versions: {},
        },
      });
    });

  await getNextRC(
    `@chappa'ai/get-next-rc`,
    '1.0.0',
    { username: 'Renddslow', password: '123' },
    httpInterface,
  );

  t.end();
});

test('Should return rc 1 when no versions match the provided version', async (t) => {
  const httpInterface = () =>
    new Promise((resolve) => {
      return resolve({
        body: {
          versions: {
            '11.0.0': {},
          },
        },
      });
    });

  const { version } = await getNextRC('@wedgekit/core', '10.0.0', {}, httpInterface);
  t.equal(version, '10.0.0-rc.1');
  t.end();
});

test('Should return rc 1 when none of the matching versions include and rc', async (t) => {
  const httpInterface = () =>
    new Promise((resolve) => {
      return resolve({
        body: {
          versions: {
            '10.0.0': {},
          },
        },
      });
    });

  const { version } = await getNextRC('@wedgekit/core', '10.0.0', {}, httpInterface);
  t.equal(version, '10.0.0-rc.1');
  t.end();
});

test(`Should return next rc when several rc's are present`, async (t) => {
  const httpInterface = () =>
    new Promise((resolve) => {
      return resolve({
        body: {
          versions: {
            '10.0.0-rc.1': {},
            '10.0.0-rc.2': {},
            '10.0.0-rc.3': {},
          },
        },
      });
    });

  const { version } = await getNextRC('@wedgekit/core', '10.0.0', {}, httpInterface);
  t.equal(version, '10.0.0-rc.4');
  t.end();
});

test(`Should return a warning flag when a matching version is found in the module`, async (t) => {
  const httpInterface = () =>
    new Promise((resolve) => {
      return resolve({
        body: {
          versions: {
            '10.0.0-rc.1': {},
            '10.0.0-rc.2': {},
            '10.0.0-rc.3': {},
            '10.0.0': {},
          },
        },
      });
    });

  const version = await getNextRC('@wedgekit/core', '10.0.0', {}, httpInterface);
  t.deepEqual(version, {
    version: '10.0.0-rc.4',
    publishedVersionExists: true,
  });
  t.end();
});
