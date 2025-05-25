import db from './config/db.js';

// Kiểm tra kết nối
console.log('Testing MongoDB connection...');

// Tạo một sự kiện khi kết nối thành công
db.on('connected', () => {
    console.log('MongoDB connected successfully!');
});

// Tạo một sự kiện khi kết nối bị lỗi
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
