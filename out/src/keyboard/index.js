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
exports.backMenu = exports.indexMenu = void 0;
const menu_1 = require("@grammyjs/menu");
const User_1 = __importDefault(require("../models/User"));
const indexMenu = new menu_1.Menu("index-menu")
    .text("ساخت عکس🔮", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    yield ctx.editMessageText("لطفا متن خود را ارسال کنید:", {
        reply_markup: backMenu
    });
    yield User_1.default.findOneAndUpdate({ userId }, { step: "send_prompt" });
}))
    .row()
    // .submenu("حساب کاربری👤", "credits-menu")
    .text("حساب کاربری👤", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    const user = yield User_1.default.findOne({ userId });
    yield ctx.editMessageText(`👨🏻مشخصات حساب شما:\nایدی: ${user === null || user === void 0 ? void 0 : user.userId}\nنام: ${user === null || user === void 0 ? void 0 : user.firstName}\nتعداد کریت: ${user === null || user === void 0 ? void 0 : user.charge}\nتاریخ عضویت: ${user === null || user === void 0 ? void 0 : user.dateJoined.toLocaleDateString("fa")}`, {
        reply_markup: backMenu
    });
}))
    .text("زیرمجموعه گیری🗣", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.editMessageText("این بخش موقتا غیر فعال است", {
        reply_markup: backMenu
    });
}))
    .row()
    .url("پشتیبانی👨🏻‍💻", "https://t.me/AppModule");
exports.indexMenu = indexMenu;
const backMenu = new menu_1.Menu("back-menu")
    .back("بازگشت", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const firstName = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name;
    const userId = ctx.from.id;
    yield User_1.default.findOneAndUpdate({ userId }, { step: "null" });
    yield ctx.editMessageText(`سلام ${firstName} عزیز\nبه ربات پرشین میدجرنی خوش اومدی\nاز طریق ربات میتونی کلی عکسای جذاب با هوش مصنوعی بسازی اونم با کیفیت بالا!\nبرای شروع از دکمه های زیر استفاده کن`);
}));
exports.backMenu = backMenu;
