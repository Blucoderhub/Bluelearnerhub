"""Telegram command center for BlueLearnerHub agents."""

import os
from telegram import Update, Bot
from telegram.ext import Updater, CommandHandler, CallbackContext

from .command_router import route_command

TOKEN = os.getenv("TELEGRAM_TOKEN")


def start(update: Update, context: CallbackContext):
    update.message.reply_text("BlueLearnerHub bot at your service. Use /help for commands.")


def help_command(update: Update, context: CallbackContext):
    update.message.reply_text(
        "/status\n/cto review_code\n/dev build_feature\n/product roadmap\n"
        "/sales generate_leads\n/sales write_email\n/deploy website\n"
    )


def handle(update: Update, context: CallbackContext):
    text = update.message.text or ""
    result = route_command(text)
    update.message.reply_text(result)


def main():
    if not TOKEN:
        print("TELEGRAM_TOKEN not set. Exiting.")
        return
    updater = Updater(TOKEN)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help_command))
    dp.add_handler(CommandHandler("status", lambda u,c: u.message.reply_text("OK")))
    dp.add_handler(CommandHandler("cto", handle))
    dp.add_handler(CommandHandler("dev", handle))
    dp.add_handler(CommandHandler("product", handle))
    dp.add_handler(CommandHandler("sales", handle))
    dp.add_handler(CommandHandler("deploy", handle))

    updater.start_polling()
    updater.idle()


if __name__ == "__main__":
    main()
