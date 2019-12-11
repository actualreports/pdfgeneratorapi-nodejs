# JavaScript module for pdfgeneratorapi.com
JavaScript module for [PDF Generator API](https://pdfgeneratorapi.com).

### Install
Require this package with npm using the following command:
```bash
npm install pdf-generator-api --save
```


### Usage
```javascript
let Client = new PDFGeneratorAPI(
  '{your_api_key}',
  '{your_api_secret}'
);
Client.setBaseUrl('https://us1.pdfgeneratorapi.com/api/v3/');
Client.setWorkspace('{unique_workspace_identifier}');

Client.getAll().then(function(response) {
    // response.response => list of templates available for users
});

Client.output('{template_id_retrived_with_getAll}', {"key": "Object, Array or url to data file"}).then(function(response) {
    // response.response => base64 document
    // response.meta => document meta data e.g name, content-type, encoding etc
});
```
```NodeJS

const pdf = require('pdf-generator-api') 

  let Client = new pdf(
  '{your_api_key}',
  '{your_api_secret}'
);
Client.setBaseUrl('https://us1.pdfgeneratorapi.com/api/v3/');
Client.setWorkspace('{unique_workspace_identifier}');

Client.getAll().then(function(response) {
    // response.response => list of templates available for users
});

Client.output('{template_id_retrived_with_getAll}', {"key": "Object, Array or url to data file"}).then(function(response) {
    // response.response => base64 document
    // response.meta => document meta data e.g name, content-type, encoding etc
});
