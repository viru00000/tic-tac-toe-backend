const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    try {
        this.password = await bcrypt.hash(this.password, 10); // Hash password
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password with hashed password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
