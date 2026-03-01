import jwt from "jsonwebtoken";

const generateToken = (id, role, shopId = null) => {
    return jwt.sign(
        { id, role, shopId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export default generateToken;