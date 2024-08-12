const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    data: { type: Object, default: {} },
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid username or password');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Received Token:', token);
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
};


const reportSchema = new mongoose.Schema({
    reportId: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    pax: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Report = mongoose.model('Report', reportSchema);

// Protected routes
app.post('/dashboard', authenticateToken, async (req, res) => {
    try {
        const reportData = req.body;
        const newReport = new Report({
            ...reportData,
            userId: req.user.id
        });
        await newReport.save();
        res.status(201).send(newReport);
    } catch (error) {
        console.error('Error saving report:', error);
        res.status(500).send('Error saving report');
    }
});

app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).send('Error fetching reports');
    }
});

app.put('/dashboard/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updatedReport = req.body;

    try {
        const result = await Report.findOneAndUpdate({ reportId: id, userId: req.user.id }, updatedReport, { new: true });
        if (!result) {
            return res.status(404).send('Report not found');
        }
        res.send(result);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).send('Error updating report');
    }
});

app.delete('/dashboard/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    console.log(`Received delete request for report ID: ${id}`);

    try {
        const reportId = parseInt(id, 10);
        if (isNaN(reportId)) {
            return res.status(400).json({ message: 'Invalid report ID' });
        }
        const result = await Report.findOneAndDelete({ reportId, userId: req.user.id });
        if (result) {
            console.log(`Report ID: ${reportId} deleted successfully`);
            res.status(200).json({ message: 'Report deleted successfully' });
        } else {
            console.log(`Report ID: ${reportId} not found`);
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
