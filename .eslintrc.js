module.exports = {
  'parser': 'babel-eslint',
  'extends': 'airbnb',
  'rules': {
    'curly': ['error', 'multi-line'],
    'eol-last': [2, 'never'],
    'indent': ['error', 2],
    'key-spacing': ['error', {
      'multiLine': {
        'beforeColon': false,
        'afterColon': true
      },
      'align': {
        'beforeColon': true,
        'afterColon': true,
        'on': 'colon'
      }
    }],
    'no-multi-spaces': ['error', {
      exceptions: {
        'VariableDeclarator': true
      }
    }],
    'space-before-function-paren': ['error', 'never'],
    'spaced-comment': [null]
  }
};
