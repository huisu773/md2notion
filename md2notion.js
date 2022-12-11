const {markdownToBlocks} = require('@tryfabric/martian');
const {Client} = require('@notionhq/client');
const dotenv = require('dotenv');
const fs = require("fs");
var program = require('commander');

dotenv.config();

program
    .version('0.0.1')
    .option('-a, --auth <auth>', 'Notion auth token')
    .option('-d, --database <database>', 'Notion database ID')
    .option('-f, --file <file>', 'Markdown file to convert')
    .parse(process.argv);

if (!program.auth) {
    console.log('No auth token provided');
    process.exit(1);
}

if (!program.database) {
    console.log('No database ID provided');
    process.exit(1);
}

if (!program.file) {
    console.log('No file provided');
    process.exit(1);
}

var filename = program.file.replace(".md", "").replace("./", "").replace(".\\", "");

var data = fs.readFileSync(program.file, 'utf8');
var blocks = markdownToBlocks(data);

const notion = new Client({auth: program.auth});

notion.pages.create({
    parent: {database_id: program.database},
    properties: {title: {type: "title", title: [{type: "text", text: {content: filename}}]}},
    children: blocks
})
