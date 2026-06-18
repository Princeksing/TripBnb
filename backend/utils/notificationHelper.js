import Notification from "../model/notification.model.js";

export async function createNotification({ userId, type, title, message, link = "" }) {
    try {
        await Notification.create({ user: userId, type, title, message, link });
    } catch (error) {
        console.error("Notification error:", error.message);
    }
}
