var jsx = require('jsx-test').jsxTranspile(process.env.COVERAGE);
var assert = require('assert');

describe('FillerText', function() {
    var FillerText = require('../src/FillerText.jsx');

    describe('#renders', function () {
        it('contains Lorem Ipsum', function () {
            jsx.assertRender(FillerText, {}, 'Lorem ipsum');
        });
    });
});
