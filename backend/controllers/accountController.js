import User from "../models/User.js";

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
    const user = await User.findById(req.user._id).select(
      "emailNotifications smsReminders appointmentAlerts billingAlerts systemUpdates"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      emailNotifications: user.emailNotifications ?? true,
      smsReminders: user.smsReminders ?? true,
      appointmentAlerts: user.appointmentAlerts ?? true,
      billingAlerts: user.billingAlerts ?? false,
      systemUpdates: user.systemUpdates ?? false,
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

    if (emailNotifications !== undefined) user.emailNotifications = !!emailNotifications;
    if (smsReminders !== undefined) user.smsReminders = !!smsReminders;
    if (appointmentAlerts !== undefined) user.appointmentAlerts = !!appointmentAlerts;
    if (billingAlerts !== undefined) user.billingAlerts = !!billingAlerts;
    if (systemUpdates !== undefined) user.systemUpdates = !!systemUpdates;

    await user.save();

    res.json({
      emailNotifications: user.emailNotifications,
      smsReminders: user.smsReminders,
      appointmentAlerts: user.appointmentAlerts,
      billingAlerts: user.billingAlerts,
      systemUpdates: user.systemUpdates,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSystemPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "language dateFormat currency theme"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      language: user.language ?? "English",
      dateFormat: user.dateFormat ?? "MM/DD/YYYY",
      currency: user.currency ?? "PHP",
      theme: user.theme ?? "Light",
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

    if (language !== undefined) user.language = language;
    if (dateFormat !== undefined) user.dateFormat = dateFormat;
    if (currency !== undefined) user.currency = currency;
    if (theme !== undefined) user.theme = theme;

    await user.save();

    res.json({
      language: user.language,
      dateFormat: user.dateFormat,
      currency: user.currency,
      theme: user.theme,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
