import { type Conversation, type ConversationFlavor } from "@grammyjs/conversations"
import { Context } from "grammy"
import { checkQueue, generateImage } from ".";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;
async function createImage(conversation: MyConversation, ctx: MyContext){
  await ctx.reply("لطفا پرامپت خود را بنویسید:")
  const prompt = await conversation.waitFor(":text")
  const result = await generateImage(prompt.toString())
  await ctx.reply(`درخواست شما با ایدی ${result.uid} وارد صف انتظار شد\nعکس به محض ساخته شدن ارسال خواهد شد`)
  const check = await checkQueue(result.uid)
  if (check) console.log(check)
  return
}

export default createImage