import ClinicSettings from "../models/ClinicSettings.js";

// @route   GET /api/settings/clinic
// @desc    Get clinic settings
export const getClinicSettings = async (req, res) => {
  try {
    let settings = await ClinicSettings.findOne();
    if (!settings) {
      settings = await ClinicSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @route   PUT /api/settings/clinic
// @desc    Update clinic settings
export const updateClinicSettings = async (req, res) => {
  try {
    let settings = await ClinicSettings.findOne();
    if (!settings) {
      settings = new ClinicSettings(req.body);
      await settings.save();
    } else {
      settings.clinicName = req.body.clinicName ?? settings.clinicName;
      settings.logoBase64 = req.body.logoBase64 ?? settings.logoBase64;
      settings.phone = req.body.phone ?? settings.phone;
      settings.email = req.body.email ?? settings.email;
      settings.address = req.body.address ?? settings.address;
      settings.openingTime = req.body.openingTime ?? settings.openingTime;
      settings.closingTime = req.body.closingTime ?? settings.closingTime;
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
