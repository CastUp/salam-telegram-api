export default async function handler(req, res) {
  // Always respond to Telegram immediately
  res.status(200).json({ ok: true });

  try {
    const update = req.body;
    const message = update?.message;
    if (!message) return;

    const chatId = message.chat.id;
    const text = message.text || "";

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const API = `https://api.telegram.org/bot${TOKEN}`;

    // -------------------------------
    // 1. When user sends /start
    // -------------------------------
    if (text === "/start") {
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Welcome to Salam App 👋\n\nPlease share your phone number to continue.",
          reply_markup: {
            keyboard: [
              [{ text: "📱 Share phone number", request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }),
      });
      return;
    }

    // -------------------------------
    // 2. When user shares contact
    // -------------------------------
    if (message.contact) {
      const phoneNumber = message.contact.phone_number;

      // You can send this to your backend / Firebase later
      console.log("📞 User phone:", phoneNumber);

      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Phone number received successfully!\nYou can now return to the app.",
          reply_markup: { remove_keyboard: true }
        }),
      });

      return;
    }

  } catch (err) {
    console.error("❌ Webhook error:", err);
  }
}
