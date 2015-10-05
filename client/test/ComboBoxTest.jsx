var jsx = require('jsx-test').jsxTranspile(process.env.COVERAGE);
var assert = require('assert');
//var sinon = require('sinon');
//var action = require('../src/ViewAction');


describe('ComboBox', function() {
    var ComboBox = require('../src/ComboBox.jsx');
    //var actionMock = sinon.mock(action);
    //actionMock.expects("getSomething").once().returns("a mock");
    //actionMock.expects("getSomething").never();

    describe('#render', function () {
        it('renders an input element', function () {
            jsx.assertRender(ComboBox, {}, '<input ');
            //actionMock.verify();
        });
    });
});
