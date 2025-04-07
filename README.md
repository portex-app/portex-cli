# @portex-app/cli

Portex CLI is a command line tool for creating and managing appliaction on multiple platforms.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@portex-app/cli.svg)](https://npmjs.org/package/@portex-app/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@portex-app/cli.svg)](https://npmjs.org/package/@portex-app/cli)

<!-- toc -->
* [@portex-app/cli](#portex-appcli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @portex-app/cli
$ portex COMMAND
running command...
$ portex (--version)
@portex-app/cli/0.1.0 darwin-arm64 node-v22.2.0
$ portex --help [COMMAND]
USAGE
  $ portex COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`portex bot APPNAME`](#portex-bot-appname)
* [`portex bot menu set APPNAME MENUURL`](#portex-bot-menu-set-appname-menuurl)
* [`portex bot message del APPNAME [KEYS]`](#portex-bot-message-del-appname-keys)
* [`portex bot message ls APPNAME`](#portex-bot-message-ls-appname)
* [`portex bot message save APPNAME MESSAGES`](#portex-bot-message-save-appname-messages)
* [`portex bot register APPNAME BOTTOKEN`](#portex-bot-register-appname-bottoken)
* [`portex deploy APPNAME PATH [DESCRIPTION]`](#portex-deploy-appname-path-description)
* [`portex help [COMMAND]`](#portex-help-command)
* [`portex login`](#portex-login)
* [`portex ls`](#portex-ls)
* [`portex new`](#portex-new)
* [`portex publish APPNAME VERSION`](#portex-publish-appname-version)

## `portex bot APPNAME`

Manage bots in the mini-app

```
USAGE
  $ portex bot APPNAME

ARGUMENTS
  APPNAME  application name
```

_See code: [src/commands/bot.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot.ts)_

## `portex bot menu set APPNAME MENUURL`

About Telegram Bot Command

```
USAGE
  $ portex bot menu set APPNAME MENUURL

ARGUMENTS
  APPNAME  appliaction name
  MENUURL  menu url

DESCRIPTION
  About Telegram Bot Command

  set Telegram Menu button
```

_See code: [src/commands/bot/menu/set.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot/menu/set.ts)_

## `portex bot message del APPNAME [KEYS]`

About Telegram Bot Command

```
USAGE
  $ portex bot message del APPNAME [KEYS]

ARGUMENTS
  APPNAME  application name
  KEYS     message keys

DESCRIPTION
  About Telegram Bot Command

  delete message(s) of a Telegram bot
```

_See code: [src/commands/bot/message/del.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot/message/del.ts)_

## `portex bot message ls APPNAME`

About Telegram Bot Command

```
USAGE
  $ portex bot message ls APPNAME

ARGUMENTS
  APPNAME  application name

DESCRIPTION
  About Telegram Bot Command

  get bot message list
```

_See code: [src/commands/bot/message/ls.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot/message/ls.ts)_

## `portex bot message save APPNAME MESSAGES`

About Telegram Bot Command

```
USAGE
  $ portex bot message save APPNAME MESSAGES

ARGUMENTS
  APPNAME   application name
  MESSAGES  bot message

DESCRIPTION
  About Telegram Bot Command

  save bot messages
```

_See code: [src/commands/bot/message/save.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot/message/save.ts)_

## `portex bot register APPNAME BOTTOKEN`

About Telegram Bot Command

```
USAGE
  $ portex bot register APPNAME BOTTOKEN

ARGUMENTS
  APPNAME   deploy appliaction name
  BOTTOKEN  telegram bot token

DESCRIPTION
  About Telegram Bot Command

  register telegram bot
```

_See code: [src/commands/bot/register.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/bot/register.ts)_

## `portex deploy APPNAME PATH [DESCRIPTION]`

Deploy mini-app

```
USAGE
  $ portex deploy APPNAME PATH [DESCRIPTION]

ARGUMENTS
  APPNAME      deploy appliaction name
  PATH         deploy appliaction path
  DESCRIPTION  deploy appliaction description

DESCRIPTION
  Deploy mini-app

  deploy mini-app, upload mini-app package from application build path.
```

_See code: [src/commands/deploy.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/deploy.ts)_

## `portex help [COMMAND]`

Display help for portex.

```
USAGE
  $ portex help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for portex.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.25/src/commands/help.ts)_

## `portex login`

Login to Portex CLI

```
USAGE
  $ portex login

DESCRIPTION
  Login to Portex CLI

  login to your portex account
```

_See code: [src/commands/login.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/login.ts)_

## `portex ls`

get application list

```
USAGE
  $ portex ls [-h]

FLAGS
  -h, --help  Displays this help information.
```

_See code: [src/commands/ls.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/ls.ts)_

## `portex new`

Create a new mini-app

```
USAGE
  $ portex new
```

_See code: [src/commands/new.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/new.ts)_

## `portex publish APPNAME VERSION`

Publish mini-app

```
USAGE
  $ portex publish APPNAME VERSION [-e dev|test|prod]

ARGUMENTS
  APPNAME  publish application name
  VERSION  publish application version

FLAGS
  -e, --env=<option>  [default: dev] publish environment
                      <options: dev|test|prod>

DESCRIPTION
  Publish mini-app

  publish mini-app to portex
```

_See code: [src/commands/publish.ts](https://github.com/portex-app/portex-cli/blob/v0.1.0/src/commands/publish.ts)_
<!-- commandsstop -->
