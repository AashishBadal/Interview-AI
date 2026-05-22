import generateToken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email
            })
        }

        let token = await generateToken(user._id);

        res.cookie("token", token, {
            http: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: `Google Auth Error ${error}` });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: `Logout Error ${error}` });
    }
}