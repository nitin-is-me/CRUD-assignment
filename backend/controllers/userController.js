const User = require('../models/User');
const nodemailer = require('nodemailer');

// email config, password etc are derived from the .env file which I'm hiding
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNotification = (email, subject, text) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text
  }, (err) => {
    if (err) console.log('Email error:', err);
    else console.log('Email sent successfully');
  });
};

exports.getUsers = async (req, res) => {
  try {
    // sorting users by putting new accounts on top
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    
    sendNotification(newUser.email, "Welcome!", `Hello ${newUser.name}, your account has been created.`);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    sendNotification(updatedUser.email, "Profile Updated", `Hello ${updatedUser.name}, your account details were updated.`);
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if(user) {
        sendNotification(user.email, "Account Deleted", `Goodbye ${user.name}, your account has been removed.`);
    }
    
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      
      // again, grouping by states, and sorting the groups in descending order
      { $sort: { count: -1 } } 
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};