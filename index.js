const axios = require('axios');
const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');

class PDFGeneratorAPI {
  constructor(key, secret, workspace, timeout)
  {
    this.baseUrl = 'https://us1.pdfgeneratorapi.com/api/v3/';
    this.key = key;
    this.secret = secret;
    this.workspace = workspace;
    this.timeout = timeout || 120000;
  }

  getRequestConfig(method, resource, params)
  {
    let headers = {
      'X-Auth-Key': this.key,
      'X-Auth-Workspace': this.workspace,
      'X-Auth-Signature': this.createSignrature(resource),
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    };

    return {
      baseURL: this.baseUrl,
      url: '/' + resource,
      timeout: this.timeout,
      headers: headers,
      responseType: 'json',
      params: params,
      method: method.toLowerCase()
    };
  }

  createSignrature(resource)
  {
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update([this.key, resource, this.workspace].join(''));
    return hmac.digest('hex');
  }

  handleError(error)
  {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.error)
    {
      errorMessage = error.response.data.error;
    }

    if (error.config && error.config.url)
    {
      errorMessage += ' (' + error.config.url +')';
    }

    return {
      error: errorMessage,
      success: false
    };
  }

  parseResponse(response)
  {
    if (!response.error && response.data)
    {
      return response.data;
    }

    return response;
  }

  dataToString(data)
  {
    if (typeof data !== 'string')
    {
      try
      {
        data = JSON.stringify(data);
      }
      catch (e)
      {

      }
    }

    return data;
  }

  sendRequest(method, resource, config)
  {
    return axios.request(Object.assign(this.getRequestConfig(method, resource), config || {}))
      .catch(this.handleError)
      .then(this.parseResponse);
  }

  /**
   * Set base url
   *
   * @param {String} url
   * @returns {PDFGeneratorAPI}
   */
  setBaseUrl(url)
  {
    this.baseUrl = url;
    return this;
  }

  /**
   * Set workspace identifier
   * @param {String} workspace
   * @returns {PDFGeneratorAPI}
   */
  setWorkspace(workspace)
  {
    this.workspace = workspace;
    return this;
  }

  /**
   * Set timeout in milliseconds
   *
   * @param {Integer} timeout
   * @returns {PDFGeneratorAPI}
   */
  setTimeout(timeout)
  {
    this.timeout = timeout;
    return this;
  }

  /**
   * Get templates available for workspace
   *
   * @param {Array} access
   * @param {Array} tags
   * @returns {Promise<T>}
   */
  getAll(access, tags)
  {
    return this.sendRequest('get', 'templates', {
      params: {
        access: access || [],
        tags: access || [],
      }
    });
  }

  /**
   * Get template configuration
   *
   * @param {String} template
   * 
   * @returns {Promise<T>}
   */
  get(template)
  {
    return this.sendRequest('get', ['templates', template].join('/'));
  }

  /**
   * Creates new template and returns configuration
   *
   * @param {String} name
   * 
   * @returns {Promise<T>}
   */
  create(name)
  {
    return this.sendRequest('post', 'templates', {
      data: {
        name: name || 'New Template'
      }
    });
  }

  /**
   * Copy template with new template
   *
   * @param {Integer} template
   * @param {String} newName
   * 
   * @returns {Promise<T>}
   */
  copy(template, newName)
  {
    return this.sendRequest('post', ['templates', template, 'copy'].join('/'), {
      data: {
        name: newName
      }
    });
  }

  /**
   *
   * @param {Integer} template
   * @param {Object|Array|String} data
   * @param {String} format
   * @param {String} name
   * @param {Object} params
   * 
   * @returns {Promise<T>}
   */
  output(template, data, format, name, params)
  {
    let config = {
      params: Object.assign({
        format: format || 'pdf',
        name: name
      }, params || {})
    };

    if (typeof data === 'string')
    {
      config.params.data = data;
    }
    else
    {
      config.data = data;
    }

    return this.sendRequest('post', ['templates', template, 'output'].join('/'), config);
  }

  /**
   * Returns editor url
   *
   * @param {Integer} template
   * @param {Object|Array|String} data
   * @param {Object} params
   *
   * @returns {string}
   */
  editor(template, data, params)
  {
    let resource = ['templates', template, 'editor'].join('/');
    params = Object.assign({
      key: this.key,
      workspace: this.workspace,
      signature: this.createSignrature(resource),
      data: this.dataToString(data)
    }, params || {});

    return url.resolve(this.baseUrl, resource) + '?' + querystring.stringify(params);
  }

  /**
   * 
   * @param {Integer} template
   * @returns {Promise<T>}
   */
  delete(template)
  {
    return this.sendRequest('delete', ['templates', template].join('/'));
  }
}

module.exports = PDFGeneratorAPI;