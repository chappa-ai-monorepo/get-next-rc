# Get Next RC

> Get the next valid release candidate version number for a given package at a given version.

## Usage

```
yarn add @chappa'ai/get-next-rc
```

```js
const nextVersion = getNextRC(`@chappa'ai/get-next-rc`, '100.1.0');
//> { version: '100.1.0-rc.1', publishedVersionExists: false }
```

## API

### Arguments

```js
getNextRC(package, version, [opts]);
```

| Argument        | Required?                             | Description                                                                         |
| --------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| `package`       | ✅                                    | The full name of the package you wish to get the next release candidate number for. |
| `version`       | ✅                                    | The package version you wish to create a release candidate for.                     |
| `opts.username` | no                                    | An npm username. This is useful when you wish to access a private module.           |
| `opts.password` | Only when `opts.username` is provided | An npm password.                                                                    |

### Response

```js
//> { version: '11.0.0-rc.1', publishedVersionExists: false }
```

| Name                     | Description                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `version`                | The next rc version based on previous rc's that have been published to npm.                                            |
| `publishedVersionExists` | If an exact match has been found on that package for the version passed into getNextRC, this flag will be set to true. |
