/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Python for text blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Python.texts');

goog.require('Blockly.Python');


Blockly.Python['text'] = function(block) {
  // Text value.
  var code = block.getFieldValue('TEXT');
  if(isNaN(parseFloat(code)) || !isFinite(code))
    code = Blockly.Python.quote_(code);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['texts_text'] = function(block) {
  var element0 = Blockly.Python.valueToCode(block, 'VAR',
          Blockly.Python.ORDER_NONE) || '\'\'';
  var code = 'str(' + element0 + ')';
  return [code, Blockly.Python.ORDER_ADDITIVE];
};

Blockly.Python['texts_int'] = function(block) {
  var element0 = Blockly.Python.valueToCode(block, 'VAR',
          Blockly.Python.ORDER_NONE) || '\'\'';
  var code = 'int(' + element0 + ')';
  return [code, Blockly.Python.ORDER_ADDITIVE];
};

Blockly.Python['texts_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return varName + ' = str(' + varName + ') + str(' + value + ')\n';
};

Blockly.Python['texts_length'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return ['len(' + text + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_NONE) || '\'\'';
  var code = 'not len(' + text + ')';
  return [code, Blockly.Python.ORDER_LOGICAL_NOT];
};

Blockly.Python['texts_indexOf'] = function(block) {
  // Search the text for a substring.
  // Should we allow for non-case sensitive???
  var operator = block.getFieldValue('END') == 'FIRST' ? 'find' : 'rfind';
  var substring = Blockly.Python.valueToCode(block, 'FIND',
      Blockly.Python.ORDER_NONE) || '\'\'';
  var text = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var code = text + '.' + operator + '(' + substring + ')';
  /*
  if (block.workspace.options.oneBasedIndex) {
    return [code + ' + 1', Blockly.Python.ORDER_ADDITIVE];
  }
  */
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_charAt'] = function(block) {
  var where = Blockly.Python.valueToCode(block, 'WHERE',
  Blockly.Python.ORDER_MEMBER) || '\'\'';
  var text = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  /*
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  switch (where) {
    case 'FIRST':
      var code = text + '[0]';
      return [code, Blockly.Python.ORDER_MEMBER];
    case 'LAST':
      var code = text + '[-1]';
      return [code, Blockly.Python.ORDER_MEMBER];
    case 'FROM_START':
      var at = Blockly.Python.getAdjustedInt(block, 'AT');
      var code = text + '[' + at + ']';
      return [code, Blockly.Python.ORDER_MEMBER];
    case 'FROM_END':
      var at = Blockly.Python.getAdjustedInt(block, 'AT', 1, true);
      var code = text + '[' + at + ']';
      return [code, Blockly.Python.ORDER_MEMBER];
    case 'RANDOM':
      Blockly.Python.definitions_['import_random'] = 'import random';
      var functionName = Blockly.Python.provideFunction_(
          'texts_random_letter',
          ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(text):',
           '  x = int(random.random() * len(text))',
           '  return text[x];']);
      code = functionName + '(' + text + ')';
      return [code, Blockly.Python.ORDER_FUNCTION_CALL];
  }
  throw 'Unhandled option (text_charAt).';
  */
  var code = text + '[' + where + ']';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_getSubstring'] = function(block) {
  // Get substring.
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var text = Blockly.Python.valueToCode(block, 'STRING',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  switch (where1) {
    case 'FROM_START':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1', 1);
      if (at1 == '0') {
        at1 = '';
      }
      break;
    case 'FROM_END':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1', 1, true);
      break;
    case 'FIRST':
      var at1 = '';
      break;
    default:
      throw 'Unhandled option (text_getSubstring)';
  }
  switch (where2) {
    case 'FROM_START':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 1);
      break;
    case 'FROM_END':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 0, true);
      // Ensure that if the result calculated is 0 that sub-sequence will
      // include all elements as expected.
      if (!Blockly.isNumber(String(at2))) {
        Blockly.Python.definitions_['import_sys'] = 'import sys';
        at2 += ' or sys.maxsize';
      } else if (at2 == '0') {
        at2 = '';
      }
      break;
    case 'LAST':
      var at2 = '';
      break;
    default:
      throw 'Unhandled option (text_getSubstring)';
  }
  var code = text + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['texts_changeCase'] = function(block) {
  // Change capitalization.
  var OPERATORS = {
    'UPPERCASE': '.upper()',
    'LOWERCASE': '.lower()',
    'TITLECASE': '.title()'
  };
  var operator = OPERATORS[block.getFieldValue('CASE')];
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var code = text + operator;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_trim'] = function(block) {
  // Trim spaces.
  var OPERATORS = {
    'LEFT': '.lstrip()',
    'RIGHT': '.rstrip()',
    'BOTH': '.strip()'
  };
  var operator = OPERATORS[block.getFieldValue('MODE')];
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var code = text + operator;
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_input'] = function(block) {
  // Input statement.
  var val = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return val + ' = input()\n';
};

Blockly.Python['texts_println'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ')\n';
};

Blockly.Python['texts_print'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ', end=\'\')\n';
};

Blockly.Python['texts_prompt_ext'] = function(block) {
  // Prompt function.
  var functionName = Blockly.Python.provideFunction_(
      'text_prompt',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(msg):',
       '  try:',
       '    return raw_input(msg)',
       '  except NameError:',
       '    return input(msg)']);
  if (block.getField('TEXT')) {
    // Internal message.
    var msg = Blockly.Python.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    var msg = Blockly.Python.valueToCode(block, 'TEXT',
        Blockly.Python.ORDER_NONE) || '\'\'';
  }
  var code = functionName + '(' + msg + ')';
  var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = 'float(' + code + ')';
  }
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['texts_prompt'] = Blockly.Python['texts_prompt_ext'];

Blockly.Python['texts_count'] = function(block) {
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var sub = Blockly.Python.valueToCode(block, 'SUB',
      Blockly.Python.ORDER_NONE) || '\'\'';
  var code = text + '.count(' + sub + ')';
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['texts_replace'] = function(block) {
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var from = Blockly.Python.valueToCode(block, 'FROM',
      Blockly.Python.ORDER_NONE) || '\'\'';
  var to = Blockly.Python.valueToCode(block, 'TO',
      Blockly.Python.ORDER_NONE) || '\'\'';
  var code = text + '.replace(' + from + ', ' + to + ')';
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['texts_reverse'] = function(block) {
  var text = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_MEMBER) || '\'\'';
  var code = text + '[::-1]';
  return [code, Blockly.Python.ORDER_MEMBER];
};
