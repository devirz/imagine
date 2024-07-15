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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const keyboard_1 = require("./src/keyboard");
const connectToDatabase_1 = __importDefault(require("./src/connectToDatabase"));
const User_1 = __importDefault(require("./src/models/User"));
const src_1 = require("./src");
const token = "6870206997:AAEyiWpIwS418SjqzLykz4VYoEtd97sCUb8";
const bot = new grammy_1.Bot(token);
bot.use(keyboard_1.indexMenu);
keyboard_1.indexMenu.register(keyboard_1.backMenu);
(0, connectToDatabase_1.default)().then(() => console.log("connected to mongodb"));
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    const firstName = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name;
    const username = ((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username) ? "@" + ctx.from.username : null;
    yield ctx.reply(`سلام ${firstName} عزیز\nبه ربات پرشین میدجرنی خوش اومدی\nاز طریق ربات میتونی کلی عکسای جذاب با هوش مصنوعی بسازی اونم با کیفیت بالا!\nبرای شروع از دکمه های زیر استفاده کن`, {
        reply_markup: keyboard_1.indexMenu
    });
    const exists = yield User_1.default.findOne({ userId });
    if (!exists) {
        yield User_1.default.create({ userId, firstName, username, charge: 5 });
        yield ctx.reply("به شما 5 کریت رایگان برای ساخت عکس هدیه داده شد🎉");
    }
}));
bot.on(":text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id;
    const user = yield User_1.default.findOne({ userId });
    console.log("from text: ", user);
    if ((user === null || user === void 0 ? void 0 : user.step) === "send_prompt") {
        const prompt = ctx.msg.text;
        if (user.charge > 0) {
            yield ctx.deleteMessages([ctx.msg.message_id - 1]);
            const result = yield (0, src_1.generateImage)(prompt);
            yield ctx.reply(`درخواست شما با ایدی ${result.uid} وارد صف انتظار شد\nعکس به محض ساخته شدن ارسال خواهد شد`);
            const check = yield (0, src_1.checkQueue)(result.uid);
            if (check)
                yield ctx.replyWithPhoto(check.image.url);
            yield User_1.default.findOneAndUpdate({ userId }, { charge: user.charge - 1 });
        }
        else {
            yield ctx.reply("موجودی شما کافی نیست");
        }
    }
}));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
bot.start({
    limit: 1
});
