import admin from "./firebase-admin.js";

export default async function handler(req, res) {
  try {
    const db = admin.firestore();

    await db.collection("test").add({
      message: "Firebase Admin is working!",
      time: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Firebase Admin connected successfully!",
    });
  } catch (error) {
    console.error("Firebase error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
