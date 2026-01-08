import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(req, res) {
  try {
    const user = await admin.auth().createUser({
      phoneNumber: "+10000000000", // رقم وهمي للاختبار
    });

    res.json({
      ok: true,
      message: "Firebase Admin is working!",
      uid: user.uid,
    });
  } catch (e) {
    res.json({
      ok: false,
      error: e.message,
    });
  }
}

