export default async function handler(req, res) {
  // Always answer Telegram
  res.status(200).json({ ok: true });

  try {
    const update = req.body;
    const message = update?.message;
    if (!message) return;

    const chatId = message.chat.id;

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const API = `https://api.telegram.org/bot${TOKEN}`;

    // Send a test reply
    await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ Bot is connected and working!",
      }),
    });
  } catch (e) {
    console.error("Webhook error:", e);
  }
}
