import _ from 'lodash'

const DocumentTypes = {

  _documentTypeMap: [
    // specific
    { type: 'pdf', file_types: ['pdf'] },
    { type: "word", file_types: ['doc', 'docx', 'docm', 'dotx', 'docb'] },
    { type: "excel", file_types: ['xlr', 'xls', 'xlsx', 'xlsm', 'xltx', 'xla', 'xlam', 'xll', 'xlw', 'xltm', 'xlt', 'xlm'] },
    { type: "power_point", file_types: ['ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm']},

    // generic
    { type: "generic_text", file_types: ['log', 'msg', 'odt', 'pages', 'rtf', 'tex', 'txt', 'wpd', 'wps'] },
    { type: 'generic_spreadsheet', file_types: ['csv', 'dat', 'ged'] },
    { type: 'generic_image', file_types: ['ai', 'bmp', 'eps', 'gif', 'jpeg', 'jpg', 'png', 'psd', 'svg', 'tif', 'tiff'] }
  ],

  _documentIconMap: {
    'pdf': 'file-pdf-box',
    'word': 'file-word-box',
    'power_point': 'file-powerpoint-box',
    'excel': 'file-excel-box',
    'generic_text': 'file-document-box',
    'generic_image': 'image',
    'generic_spreadsheet': 'file-document-box',
    'unknown': 'file-document-box'
  },

  _documentNameStringMap: {
    'pdf': 'PDF',
    'word': 'Word',
    'power_point': 'PowerPoint',
    'excel': 'Excel',
    'generic_text': 'Generic Text',
    'generic_image': 'Image',
    'generic_spreadsheet': 'Generic Spreadsheet',
    'unknown': 'Unknown Type'
  },

  getDocumentType: function(extension) {
    return _.get(_.find(this._documentTypeMap, { file_types: [extension.toLowerCase().replace(/\W/g, '')] }), 'type') || 'unknown'
  },

  getDocumentIcon: function(extension) {
    return this._documentIconMap[this.getDocumentType(extension)]
  },

  getDocumentNameString: function(extension) {
    return this._documentNameStringMap[this.getDocumentType(extension)]
  }
}
export default DocumentTypes
