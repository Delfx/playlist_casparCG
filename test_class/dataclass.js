
const TestClass = require('./Testclass.js');

const testClass = new TestClass();

class DataClass {
    constructor () {
        this.testClassInstance = new TestClass();
    }
}


