import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

const userRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isVerified = false; // Mặc định chưa xác thực
        const resetPasswordToken = null;
        const resetPasswordExpires = null;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Người dùng đã tồn tại!"
            });
        }

        // Lấy ID lớn nhất hiện tại
        const lastUser = await User.findOne().sort({ id: -1 });
        let newId = 'U0001';
        if (lastUser && lastUser.id) {
            const currentId = parseInt(lastUser.id.replace('U', ''));
            newId = `U${(currentId + 1).toString().padStart(4, '0')}`;
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
            resetPasswordExpires,
            id: newId,
            role: 'User'
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

        const token = jwt.sign({ 
            userId: user.id, // Sử dụng ID người dùng
            email: user.email 
        }, process.env.ACCESS_TOKEN, {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        }).status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
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

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại'
            });
        }

// Không kiểm tra role là admin nữa, cho phép xóa cả admin

        // Xóa người dùng
        const result = await User.deleteOne({ id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Không thể xóa người dùng'
            });
        }
        
        res.status(200).json({
            message: 'Người dùng đã được xóa thành công'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Lỗi khi xóa người dùng',
            error: error.message
        });
    }
};

const addUser = async (req, res) => {
    try {
        const { 
            name,
            email,
            password,
            role = 'User'
        } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email đã được sử dụng'
            });
        }

        // Tạo ID mới
        const lastUser = await User.findOne().sort({ id: -1 });
        let newId = 'U0001';
        if (lastUser && lastUser.id) {
            const currentId = parseInt(lastUser.id.replace('U', ''));
            newId = `U${(currentId + 1).toString().padStart(4, '0')}`;
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            id: newId,
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true // Khi thêm từ admin thì tự động xác thực
        });

        await user.save();
        res.status(201).json({
            message: 'Người dùng đã được thêm thành công',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại'
            });
        }

        // Chỉ cho phép cập nhật name và mật khẩu
        const updates = {};
        
        if (updateData.name !== undefined) {
            updates.name = updateData.name;
        }
        if (updateData.password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updateData.password, salt);
        }

        // Cập nhật người dùng
        const updatedUser = await User.findOneAndUpdate(
            { id },
            updates,
            { new: true, runValidators: true }
        );

        // Chỉ trả về các trường cần thiết
        const userResponse = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json({
            message: 'Người dùng được cập nhật thành công',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại'
            });
        }

        // Chỉ trả về các trường cần thiết
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    userRegistration, 
    userLogin, 
    userPasswordForget, 
    userPasswordReset,
    userVerifyEmail,
    userLogout,
    getAllUsers,
    deleteUser,
    addUser,
    updateUser,
    getUserById
};