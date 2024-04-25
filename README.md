# Leakz

**Leakz** is [Caido](https://caido.io)'s passive workflow to find potential leaked secrets, PII, and sensitive fields.

## Install

1. Download the workflow file via [releases page](https://github.com/dwisiswant0/leakz-passive-workflow/releases) or: `wget https://github.com/dwisiswant0/leakz/raw/master/dist/Leakz.json`.
1. In Caido, navigate to **Testing > Workflows**, then **Import** the workflow file.

— or

1. Just execute: `bun run workflow:install`.
1. After that, refresh your Caido instance by right-clicking and selecting **Reload**.

> [!NOTE]
> To update, you must first uninstall it using `bun run workflow:uninstall`,
> and then reinstall it to apply the changes.

That's it!

> [!IMPORTANT]
> Response interception needs to be enabled for this passive workflow to work properly.

## Development

> [!NOTE]
> [Bun](https://bun.sh) toolkit is required.

* Build _(bundled)_ the sources: `bun run build`.
* Compile into Caido workflow: `bun run compile`.

## Caveats

Currently, I understand that it's challenging to selectively opt-in or out of certain kinds of leaks and/or to exclude specific patterns while maintaining good UX.

By default, Leakz does **NOT** scan for PII & sensitive fields; you can configure this in the [`config.ts`](/src/config.ts) file and then rebuild and compile the source to apply them.

### Limitations

Leakz currently does not offer scanning for leaks in request/response headers. See https://github.com/caido/caido/issues/972.

## License

The [patterns](/src/db.json) is curated from [mazen160/secrets-patterns-db](https://github.com/mazen160/secrets-patterns-db).

Leakz is released with ♡ by **@dwisiswant0** under the Apache 2.0 license. See [LICENSE](/LICENSE).