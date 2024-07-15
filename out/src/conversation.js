"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function createImage(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("لطفا پرامپت خود را بنویسید:");
        const prompt = yield conversation.waitFor(":text");
        const result = yield (0, _1.generateImage)(prompt.toString());
        yield ctx.reply(`درخواست شما با ایدی ${result.uid} وارد صف انتظار شد\nعکس به محض ساخته شدن ارسال خواهد شد`);
        const check = yield (0, _1.checkQueue)(result.uid);
        if (check)
            console.log(check);
        return;
    });
}
exports.default = createImage;
