import {Api, Bot, Context, GrammyError, HttpError, type RawApi} from "grammy"
import {backMenu, backPanel, indexMenu, panel} from "./src/keyboard"
import connect from "./src/connectToDatabase"
import User from "./src/models/User"
import {checkQueue, generateImage} from "./src"

const token: string = "6870206997:AAEyiWpIwS418SjqzLykz4VYoEtd97sCUb8"

interface BotConfig {
  botDeveloper: number;
  isDeveloper: boolean;
}

const bot = new Bot<Context & { config: BotConfig }, Api<RawApi>>(token)

const BOT_DEVELOPER = 1913245253; // bot developer chat identifier

bot.use(async (ctx, next) => {
  // Modify context object here by setting the config.
  ctx.config = {
    botDeveloper: BOT_DEVELOPER,
    isDeveloper: ctx.from?.id === BOT_DEVELOPER,
  };
  // Run remaining handlers.
  await next();
});

bot.use(indexMenu)
bot.use(panel)

indexMenu.register(backMenu)
panel.register(backPanel)

connect().then(() => console.log("connected to mongodb"))

bot.command("start", async ctx => {
  const userId = ctx.from?.id
  const firstName = ctx.from?.first_name
  const username = ctx.from?.username ? "@" + ctx.from.username : null
  await ctx.reply(`سلام ${firstName} عزیز\nبه ربات پرشین میدجرنی خوش اومدی\nاز طریق ربات میتونی کلی عکسای جذاب با هوش مصنوعی بسازی اونم با کیفیت بالا!\nبرای شروع از دکمه های زیر استفاده کن`, {
    reply_markup: indexMenu
  })
  const exists = await User.findOne({userId})
  if (!exists) {
    await User.create({userId, firstName, username, charge: 5})
    await ctx.reply("به شما 5 کریت رایگان برای ساخت عکس هدیه داده شد🎉")
  }
})
type inf = { to?: string }
let stats: inf = {}
bot.on(":text", async ctx => {
  const userId = ctx.from?.id
  const user = await User.findOne({userId})
//  const msg = ctx.msg.text
  if (user?.step === "send_charge") {
    const toUser = ctx.msg.text
    // @ts-ignore
    status.to = toUser
    const userExists = await User.findOne({userId: toUser})
    if (userExists) {
      await ctx.reply("لطفا مقدار کریت را ارسال کنید")
      await User.findOneAndUpdate({userId}, {step: "send_credit"})
    } else {
      await ctx.reply("کاربر در دیتابیس وجود ندارد")
      await User.findOneAndUpdate({userId}, {step: "null"})
    }
  }
  if (user?.step === "send_credit") {
    const amount = ctx.msg.text
    await User.findOneAndUpdate({userId: stats.to}, {charge: amount})
    await ctx.reply("حساب مورد نظر شارژ شد")
    await User.findOneAndUpdate({userId}, {step: "null"})
  }
  if (user?.step === "send_prompt") {
    const prompt = ctx.msg.text
    if (user.charge > 0) {
      await ctx.deleteMessages([ctx.msg.message_id - 1])
      const result = await generateImage(prompt)
      await ctx.reply(`درخواست شما با ایدی ${result.uid} وارد صف انتظار شد\nعکس به محض ساخته شدن ارسال خواهد شد`)
      const check = await checkQueue(result.uid)
      if (check) await ctx.replyWithPhoto(check.image.url)
      await User.findOneAndUpdate({userId}, {charge: user.charge - 1, step: "null"})
    } else {
      await ctx.reply("موجودی شما کافی نیست")
      await User.findOneAndUpdate({userId}, {step: "null"})
    }
  }
})

bot.command("panel", async ctx => {
  if (ctx.config.isDeveloper) {
    await ctx.reply("admin panel", {reply_markup: panel})
  }
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start({
  limit: 1
})