class TestClass {
    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}


const data = {name: "Tadas", age: 21, sex: "male"};

const testClass = new TestClass(data);

data.age = 22;

console.log(data);
console.log(testClass.getData());