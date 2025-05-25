import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

const userRegistration = async (req, res) => {
    try {
        const { name, email, password, isVerified, resetPasswordToken, resetPasswordExpires } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Người dùng đã tồn tại!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name,
            email,
            password: hashedPassword,
            isVerified,
            verificationToken,
            resetPasswordToken,
            resetPasswordExpires
        });

        await user.save();

        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`; // frontennd url // http://localhost:5173/verify-email/${verificationToken}

        const emailContent = `
            <h2>Xác thực Email</h2>
            <p>Nhấp vào liên kết bên dưới để xác minh email của bạn:</p>
            <a href="${verificationLink}" target="_blank">${verificationLink}</a>
        `;

        await sendEmail(user.email, 'Verify your Email', emailContent);

        return res.status(201).json({
            message: "Người dùng đã đăng ký thành công! Vui lòng kiểm tra email của bạn và xác minh email",
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};

const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Sai Email hoặc mật khẩu"
            })
        }

        const token = jwt.sign({ userId: user?._id, userEmail: user?.email }, process.env.ACCESS_TOKEN, {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        }).status(200).json({
            message: 'Đăng nhập thành công',
            token
        })

    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server!'
        })
    }
};

const userPasswordForget = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Người dùng không tồn tại!'
            })
        };

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // frontend url // http://localhost:5173/reset-password/${resetToken}


        const emailContent = `
            <h2>Yêu cầu đặt lại mật khẩu</h2>
            <p>Nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            <p>Liên kết này sẽ hết hạn sau 1 giờ</p>
        `;

        await sendEmail(user?.email, 'Password reset Request', emailContent);

        res.status(200).json({
            message: 'Email đặt lại mật khẩu đã được gửi',
            resetToken
        })


    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server!'
        })
    }
};


const userPasswordReset = async (req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;

        // Find user by reset token and check if token is still valid 

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Mã thông báo không hợp lệ hoặc đã hết hạn'
            })
        };

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            message: 'Mật khẩu được đặt lại thành công!',
            user
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'Lỗi server!'
        })
    }
};

const userVerifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                message: 'Mã thông báo xác minh không hợp lệ hoặc đã hết hạn'
            })
        };

        user.isVerified = true,
            user.verificationToken = undefined;

        await user.save();

        res.status(200).json({
            message: 'Xác thực Email thành công!',
            user
        });



    }
    catch (error) {
        res.status(500).json({
            message: 'Lỗi server!'
        })
    }
};

const userLogout = async (req, res) => {
    try {

        res.clearCookie('token',

            {
                httpOnly: true,
                secure: false,
                samesite: 'strict'
            }
        );

        res.status(200).json({
            message: 'Đăng xuất thành công'
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'Lỗi server!'
        })
    }
}

export { userRegistration, userLogin, userPasswordForget, userPasswordReset, userVerifyEmail, userLogout };