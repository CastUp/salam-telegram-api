export default async function handler(req, res) {
  // لازم نرد 200 فورًا
  res.status(200).json({ ok: true });

  try {
    const update = req.body;
    const msg = update?.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const text = msg.text || "";

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const API = `https://api.telegram.org/bot${TOKEN}`;

    // =========================
    // طلب الرقم عند /start
    // =========================
    if (text.startsWith("/start")) {
      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🔐 لتسجيل الدخول اضغط الزر لمشاركة رقمك.",
          reply_markup: {
            keyboard: [[{ text: "📱 مشاركة رقم الهاتف", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        })
      });
      return;
    }

    // =========================
    // استقبال الرقم بأمان
    // =========================
    if (msg.contact) {

      // أهم تحقق أمني
      if (msg.contact.user_id !== msg.from.id) {
        await fetch(`${API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "❌ لا يمكن استخدام رقم شخص آخر."
          })
        });
        return;
      }

      const phone = msg.contact.phone_number;

      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ تم استلام رقمك بنجاح:\n${phone}\n\nارجع للتطبيق لإكمال الدخول.`,
          reply_markup: { remove_keyboard: true }
        })
      });

      // هنا لاحقًا هنربط الرقم بـ Flutter / Firebase
    }

  } catch (e) {
    console.error("Webhook error:", e);
  }
}


