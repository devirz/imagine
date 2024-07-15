import { Menu } from "@grammyjs/menu"
import User from "../models/User"

const indexMenu = new Menu("index-menu")
  .text("ساخت عکس🔮", async ctx => {
    const userId = ctx.from.id
    await ctx.editMessageText("لطفا متن خود را ارسال کنید:", {
      reply_markup: backMenu
    })
    await User.findOneAndUpdate({ userId }, { step: "send_prompt" })
  })
  .row()
  // .submenu("حساب کاربری👤", "credits-menu")
  .text("حساب کاربری👤", async ctx => {
    const userId = ctx.from.id
    const user = await User.findOne({ userId })
    await ctx.editMessageText(`👨🏻مشخصات حساب شما:\nایدی: ${user?.userId}\nنام: ${user?.firstName}\nتعداد کریت: ${user?.charge}\nتاریخ عضویت: ${user?.dateJoined.toLocaleDateString("fa")}`, {
      reply_markup: backMenu
    })
  })
  .text("زیرمجموعه گیری🗣", async ctx => {
    await ctx.editMessageText("این بخش موقتا غیر فعال است", {
      reply_markup: backMenu
    })
  })
  .row()
  .url("پشتیبانی👨🏻‍💻", "https://t.me/AppModule")

const backMenu = new Menu("back-menu")
  .back("بازگشت", async ctx => {
    const firstName = ctx.from?.first_name
    const userId = ctx.from.id
    await User.findOneAndUpdate({ userId }, { step: "null" })
    await ctx.editMessageText(`سلام ${firstName} عزیز\nبه ربات پرشین میدجرنی خوش اومدی\nاز طریق ربات میتونی کلی عکسای جذاب با هوش مصنوعی بسازی اونم با کیفیت بالا!\nبرای شروع از دکمه های زیر استفاده کن`)
  })

export {
  indexMenu,
  backMenu
}