"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// export default mongoose.connect('mongodb://127.0.0.1:27017/imagine');
mongoose_1.default.connect('mongodb://127.0.0.1:27017/myapp').then(function (d) { return console.log("connected to db "); });
