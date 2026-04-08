import Notification from "../models/Notification.js";

// @route   GET /api/notifications
// @desc    Get all notifications for logged in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 notifications
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications for logged in user as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/notifications
// @desc    Create a new notification (mostly for internal/test use here)
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, link } = req.body;
    
    const notification = new Notification({
      userId: req.user._id,
      title,
      message,
      type,
      link
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
