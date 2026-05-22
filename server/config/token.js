import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" })
    } catch (error) {
        console.log(error)
    }
}

export default generateToken