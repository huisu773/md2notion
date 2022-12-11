# md2notion

Import markdown to notion using [Martian](https://github.com/tryfabric/martian) and [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js).

## Usage

```bash
npm install @notionhq/client
npm install @tryfabric/martian
```

```bash
node md2notion.js -a <auth> -d <database> -f <file>
```

- <auth>: notion integration token
- <database>: database id
- <file>: filename
