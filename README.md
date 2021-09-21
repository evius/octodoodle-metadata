cryptopi-crew-metadata
======================

CLI for generating Cryptopi Crew metadata and publishing to IPFS

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cryptopi-crew-metadata.svg)](https://npmjs.org/package/cryptopi-crew-metadata)
[![Downloads/week](https://img.shields.io/npm/dw/cryptopi-crew-metadata.svg)](https://npmjs.org/package/cryptopi-crew-metadata)
[![License](https://img.shields.io/npm/l/cryptopi-crew-metadata.svg)](https://github.com/CryptopiCrew/cryptopi-crew-metadata/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cryptopi-crew-metadata
$ cryptopi-meta COMMAND
running command...
$ cryptopi-meta (-v|--version|version)
cryptopi-crew-metadata/0.0.0 darwin-x64 node-v12.14.0
$ cryptopi-meta --help [COMMAND]
USAGE
  $ cryptopi-meta COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cryptopi-meta hello [FILE]`](#cryptopi-meta-hello-file)
* [`cryptopi-meta help [COMMAND]`](#cryptopi-meta-help-command)

## `cryptopi-meta hello [FILE]`

describe the command here

```
USAGE
  $ cryptopi-meta hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cryptopi-meta hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/CryptopiCrew/cryptopi-crew-metadata/blob/v0.0.0/src/commands/hello.ts)_

## `cryptopi-meta help [COMMAND]`

display help for cryptopi-meta

```
USAGE
  $ cryptopi-meta help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
