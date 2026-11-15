const User = require("../models/User");

const splitName = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    return {
        firstName: parts[0] || "Citizen",
        lastName: parts.slice(1).join(" "),
        fullName: parts.join(" ") || "Citizen",
    };
};

class AuthController {
    static async syncUser(req, res, next) {
        try {
            const { name, email, profileImage } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "An email address is required to set up your account.",
                });
            }

            const identity = splitName(name);
            const user = await User.findOneAndUpdate(
                { clerkId: req.clerkUserId },
                {
                    $set: {
                        ...identity,
                        email: email.toLowerCase().trim(),
                        profileImage: profileImage || "",
                        lastLogin: new Date(),
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req, res) {
        return res.status(200).json({ success: true, data: req.user });
    }
}

module.exports = AuthController;
