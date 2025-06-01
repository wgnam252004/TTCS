import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^C\d{4}$/.test(v);
            },
            message: props => `${props.value} không phải là ID hợp lệ. ID phải bắt đầu bằng C và có 5 ký tự (ví dụ: C0001)`
        }
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Cinema', cinemaSchema, 'Cinema');
