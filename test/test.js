const PDFGeneratorAPI = require('../index');
const assert = require('assert');
const buffer = require('buffer').Buffer;
const fs = require('fs');
const url = require('url');
const host = 'http://127.0.0.3';
const documentData = [
  {
    "DocNumber": "123123123"
  }
];
const handleAsync = function(response, done, isValid) {
  if (isValid)
  {
    isValid = function(response)
    {
      return !response.error;
    };
  }

  if (isValid(response))
  {
    done();
  }
  else
  {
    done(new Error(response.error || 'Invalid response'));
  }
};

let Client = new PDFGeneratorAPI(
  '61e5f04ca1794253ed17e6bb986c1702',
  '68db1902ad1bb26d34b3f597488b9b28',
  'demo.example@actualreports.com'
);

Client.setBaseUrl(host + '/api/v3');


describe('getAll', function() {
  it('Should return array of templates', function(done) {
    Client.getAll().then((response) => {
      handleAsync(response, done, function(response) {
        return response.response.length;
      });
    });
  });
});

describe('get', function() {
  it('Should return template configuration', function(done) {
    Client.get(21650).then((response) => {
      handleAsync(response, done, function(response) {
        return !response.error && +response.response.id === 21650;
      });
    });
  });
});

describe('create', function() {
  it('Should create new template and return configuration', function(done) {
    Client.create('Test NodeJS module').then((response) => {
      handleAsync(response, done, function(response) {
        return !response.error && response.response.name === 'Test NodeJS module';
      });
    });
  });
});

describe('copy', function() {
  it('Should copy template and return template configuration', function(done) {
    Client.copy(21650, 'Test NodeJS module Copy').then((response) => {
      handleAsync(response, done, function(response) {
        return !response.error && response.response.name === 'Test NodeJS module Copy';
      });
    });
  });
});

describe('delete', function() {
  it('Should delete template', function(done) {
    Client.create('Test NodeJS module Delete').then((response) => {
      Client.delete(+response.response.id).then((response) => {
        handleAsync(response, done, function(response) {
          return !response.error && response.response.success;
        });
      });
    });
  });
});

describe('output', function() {
  this.timeout(0);

  it('Should returns base64 output', function(done) {
    Client.output(21650, documentData, 'pdf', 'Test NodeJS module Output').then((response) => {
      try
      {
        fs.writeFileSync('test/files/'+response.meta.name, buffer.from(response.response, 'base64'));

        handleAsync(response, done, function(response) {
          return !response.error && response.meta && response.meta.display_name === 'Test NodeJS module Output';
        });
      }
      catch (e)
      {
        done(e);
      }
    });
  });
});

describe('editor', function() {
  it('Should return editor url', function() {
    const editorUrl = Client.editor(21650, documentData);
    const urlData = url.parse(editorUrl);
    assert.equal(urlData.protocol + '//' + urlData.host, host);
  });
});