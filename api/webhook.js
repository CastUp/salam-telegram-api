export default async function handler(req, res) {
  // Always respond 200 to Telegram immediately
  res.status(200).json({ ok: true });

  try {
    const update = req.body;
    const message = update?.message;
    if (!message) return;

    const chatId = message.chat.id;
    const text = message.text || "";

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!TOKEN) {
      console.error("Missing TELEGRAM_BOT_TOKEN");
      return;
    }

    const API = `https://api.telegram.org/bot${TOKEN}`;

    // Helper function to send messages to Telegram
    async function sendMessage(payload) {
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    // =========================
    // 1. When user starts the bot
    // =========================
    if (text.startsWith("/start")) {
      await sendMessage({
        chat_id: chatId,
        text: "🔐 To continue, please share your phone number.",
        reply_markup: {
          keyboard: [[{ text: "📱 Share phone number", request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      return;
    }

    // =========================
    // 2. When user sends contact
    // =========================
    if (message.contact) {
      const contact = message.contact;

      // 🔒 Security check: make sure the number belongs to the same user
      if (contact.user_id !== message.from.id) {
        await sendMessage({
          chat_id: chatId,
          text: "❌ You cannot use someone else's phone number.",
        });
        return;
      }

      const phoneNumber = contact.phone_number;

      await sendMessage({
        chat_id: chatId,
        text:
          "✅ Your phone number was received successfully:\n\n" +
          phoneNumber +
          "\n\nPlease return to the app to complete login.",
        reply_markup: { remove_keyboard: true },
      });

      // 👉 Later we will connect this phone number with Flutter / Firebase
    }
  } catch (error) {
    console.error("Webhook error:", error);
  }
}
