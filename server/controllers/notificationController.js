const Notification = require('../models/Notification');

// @desc    Get all notifications for user
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/mark-read/:notificationId
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
