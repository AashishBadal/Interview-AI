import jwt from "jsonwebtoken";

export const isAuth = async (req,res,next)=>{
    try {
        let {token} = req.cookies;
        if (!token) {
            return res.status(401).json({message:"User Unauthorized"})
        }

        const verifytoken = jwt.verify(token,process.env.JWT_SECRET);

        if(!verifytoken){
            return res.status(401).json({message:"Invalid Token"})
        }

        req.userId = verifytoken.userId;
        
        next();
    
    } catch (error) {
        return res.status(500).json({message:`Error during authentication : ${error}`})
    }
}