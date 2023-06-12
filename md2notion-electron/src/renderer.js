const authInput = document.getElementById('auth');
const databaseIdInput = document.getElementById('database-id');
const submitButton = document.getElementById('submit');
const dropArea = document.getElementById('drop-area');
const statusIcon = document.getElementById('status-icon');
const fileNameElement = document.getElementById('file-name');

const { markdownToBlocks } = require('@tryfabric/martian');
const { Client } = require('@notionhq/client');

let fileContent = null;

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.add('highlight');
});

dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove('highlight');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove('highlight');

  var file = e.dataTransfer.files[0];
  if (!file) {
      alert('No file was dropped. Please try again.');
      return;
  }

  if (!file.name.endsWith('.md')) {
      alert('Invalid file type. Please drop a Markdown file (with .md extension).');
      return;
  }

  var file = e.dataTransfer.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var text = e.target.result;
    // console.log(text);
    fileContent = text;
  };
  reader.readAsText(file);

  statusIcon.hidden = false;
  fileNameElement.textContent = file.name;
});

submitButton.addEventListener('click', () => {
  if (!fileContent) {
    alert('No file was dropped. Please try again.');
    return;
  }
  if (!authInput.value) {
    alert('Please enter your Notion integration token.');
    return;
  }
  if (!databaseIdInput.value) {
    alert('Please enter your Notion database ID.');
    return;
  }
  processFileAndSendToNotion(fileContent);
});

// Add a new function to process the file and send the result to Notion
async function processFileAndSendToNotion(file) {
  try {
    var blocks = markdownToBlocks(file);
    const notion = new Client({ auth: authInput.value });
    var filename = fileNameElement.textContent.replace('.md', '');

    // Store the created page in a variable
    const createdPage = await notion.pages.create({
      parent: { database_id: databaseIdInput.value },
      properties: {
        title: {
          type: "title",
          title: [{ type: "text", text: { content: filename } }]
        }
      },
      children: blocks
    });

    if (createdPage) {
      alert('File successfully processed and sent to Notion.');
    } else {
      alert('Failed to process file and send to Notion.');
    }
  } catch (error) {
    console.error('Error processing file and sending to Notion:', error);
    alert('An error occurred while processing the file and sending to Notion. Please check the console for more information.');
  }
}

