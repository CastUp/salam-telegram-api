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

export default function handler(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Firebase Admin connected successfully!",
    });
  } catch (err) {
    console.error("Firebase init error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
