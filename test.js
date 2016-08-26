
var micro = require("./microSerializer.js");

var testObj1 = { name: "john", age: 34 };
var testObj2 = { name: "jane", age: 31 };
var testObj3 = { name: "jack", age: 4 };

var testObj4 = { a: testObj1, b: testObj2, c: testObj3 };

var testObj5 = [testObj4, testObj4, testObj4];

var testResult = micro.micro.QueryStringSerializer.serialize(testObj1);

var testObj = { name: "john", accounts: ["a", "b", "c"], friends: [testObj1, testObj2, testObj3], bestFriend: testObj1, misc: testObj4, last: testObj5}

testResult = micro.micro.QueryStringSerializer.serialize(testObj);

testObj = { friend: testObj1 }

testResult = micro.micro.QueryStringSerializer.serialize(testObj);


testObj = { friends: [testObj1, testObj2, testObj3] }

testResult = micro.micro.QueryStringSerializer.serialize(testObj);

var x = 1;