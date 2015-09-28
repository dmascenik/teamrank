var jsx = require('jsx-test').jsxTranspile(process.env.COVERAGE);
var assert = require('assert');

describe('ComboBox', function() {
    var ComboBox = require('../src/ComboBox.jsx');

    describe('#render', function () {
        it('renders an input element', function () {
            jsx.assertRender(ComboBox, {}, '<input ');
        });
    });
});
