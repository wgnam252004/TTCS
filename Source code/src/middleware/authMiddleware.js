import { message } from 'antd';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const {token} = req.cookies

        if(!token) {
            return res.status(401).json({
                message: 'Access denied. No token provided.'
            })
        };

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded

        next();
    }

    catch (error){
        res.status(400).json({message:'Invalid Token'})
    }
}

export default authMiddleware