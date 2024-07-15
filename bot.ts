import { Api, Bot, Context, GrammyError, HttpError, session, type RawApi } from "grammy"
import { backMenu, indexMenu } from "./src/keyboard"
import connect from "./src/connectToDatabase"
import User from "./src/models/User"
import { Conversation, ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations"

import createImage from "./src/conversation"
import { checkQueue, generateImage } from "./src"

const token: string = "6870206997:AAEyiWpIwS418SjqzLykz4VYoEtd97sCUb8"

type myContext = Context & ConversationFlavor
// type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<myContext>;
const bot = new Bot<myContext, Api<RawApi>>(token)

bot.use(indexMenu)

indexMenu.register(backMenu)

connect().then(() => console.log("connected to mongodb"))

bot.command("start", async ctx => {
  const userId = ctx.from?.id
  const firstName = ctx.from?.first_name
  const username = ctx.from?.username ? "@" + ctx.from.username : null
  await ctx.reply(`سلام ${firstName} عزیز\nبه ربات پرشین میدجرنی خوش اومدی\nاز طریق ربات میتونی کلی عکسای جذاب با هوش مصنوعی بسازی اونم با کیفیت بالا!\nبرای شروع از دکمه های زیر استفاده کن`, {
    reply_markup: indexMenu
  })
  const exists = await User.findOne({ userId })
  if (!exists) {
    await User.create({ userId, firstName, username, charge: 5 })
    await ctx.reply("به شما 5 کریت رایگان برای ساخت عکس هدیه داده شد🎉")
  }
})

bot.on(":text", async ctx => {
  const userId = ctx.from?.id
  const user = await User.findOne({ userId })
  console.log("from text: ", user)
  if(user?.step === "send_prompt"){
    const prompt = ctx.msg.text
    if(user.charge > 0){
      await ctx.deleteMessages([ctx.msg.message_id - 1])
      const result = await generateImage(prompt)
      await ctx.reply(`درخواست شما با ایدی ${result.uid} وارد صف انتظار شد\nعکس به محض ساخته شدن ارسال خواهد شد`)
      const check = await checkQueue(result.uid)
      if (check) await ctx.replyWithPhoto(check.image.url)
      await User.findOneAndUpdate({ userId }, { charge: user.charge - 1})
    } else {
      await ctx.reply("موجودی شما کافی نیست")
    }
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