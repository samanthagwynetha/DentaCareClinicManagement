import User from "../src/models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email role phone avatarBase64");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      avatarBase64: user.avatarBase64 || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatarBase64 } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (avatarBase64 !== undefined) user.avatarBase64 = avatarBase64;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone || "",
      avatarBase64: updated.avatarBase64 || "",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notificationPrefs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prefs = user.notificationPrefs || {};
    res.json({
      emailNotifications: prefs.emailNotifications ?? true,
      smsReminders: prefs.smsReminders ?? true,
      appointmentAlerts: prefs.appointmentAlerts ?? true,
      billingAlerts: prefs.billingAlerts ?? false,
      systemUpdates: prefs.systemUpdates ?? false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const {
      emailNotifications,
      smsReminders,
      appointmentAlerts,
      billingAlerts,
      systemUpdates,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.notificationPrefs) user.notificationPrefs = {};
    if (emailNotifications !== undefined) user.notificationPrefs.emailNotifications = !!emailNotifications;
    if (smsReminders !== undefined) user.notificationPrefs.smsReminders = !!smsReminders;
    if (appointmentAlerts !== undefined) user.notificationPrefs.appointmentAlerts = !!appointmentAlerts;
    if (billingAlerts !== undefined) user.notificationPrefs.billingAlerts = !!billingAlerts;
    if (systemUpdates !== undefined) user.notificationPrefs.systemUpdates = !!systemUpdates;
    user.markModified('notificationPrefs');

    await user.save();

    res.json({
      emailNotifications: user.notificationPrefs.emailNotifications,
      smsReminders: user.notificationPrefs.smsReminders,
      appointmentAlerts: user.notificationPrefs.appointmentAlerts,
      billingAlerts: user.notificationPrefs.billingAlerts,
      systemUpdates: user.notificationPrefs.systemUpdates,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSystemPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("systemPrefs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prefs = user.systemPrefs || {};
    res.json({
      language: prefs.language ?? "English",
      dateFormat: prefs.dateFormat ?? "MM/DD/YYYY",
      currency: prefs.currency ?? "PHP",
      theme: prefs.theme ?? "Light",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSystemPreferences = async (req, res) => {
  try {
    const { language, dateFormat, currency, theme } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.systemPrefs) user.systemPrefs = {};
    if (language !== undefined) user.systemPrefs.language = language;
    if (dateFormat !== undefined) user.systemPrefs.dateFormat = dateFormat;
    if (currency !== undefined) user.systemPrefs.currency = currency;
    if (theme !== undefined) user.systemPrefs.theme = theme;
    user.markModified('systemPrefs');

    await user.save();

    res.json({
      language: user.systemPrefs.language,
      dateFormat: user.systemPrefs.dateFormat,
      currency: user.systemPrefs.currency,
      theme: user.systemPrefs.theme,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
