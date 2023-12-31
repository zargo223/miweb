const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const { loadData, saveData, deleteDataAuth, linksData } = require('../helpers/helpers');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { users } = require('../db/users');
const { JWT_KEY } = require('../config/config');
const { verifyToken } = require('../middlewares/authMiddleware');
const { sessionMiddleware } = require('../middlewares/sessionMiddleware');

const router = Router();

const DATA_FILE = path.join(__dirname, '../db/data.json');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/dashboard', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

/* Links */

router.get('/links', async (req, res) => {
    try {
        let links = await linksData();
        res.json({ status: 201, message: "Get links", data: links });
    } catch (error) {
        res.json({ status: 400, message: "Error get links" });
    }
});

router.get('/links/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let links = await linksData();

        const linkToFind = links.find(link => link.id === id);

        res.json({ status: 201, message: "Get link", data: linkToFind });
    } catch (error) {
        res.json({ status: 400, message: "Error get link" });
    }
});

router.post('/links', verifyToken, async (req, res) => {
    try {
        const id = uuidv4();
        const { valueLink, link } = req.body;
        let links = await linksData();
        links.push({ id, valueLink, link });
        fs.writeFileSync(DATA_FILE, JSON.stringify(links), 'utf8');
        res.json({ status: 201, message: "Link created" });
    } catch (error) {
        res.json({ status: 400, message: "Error to created link" });
    }
})

router.put('/links/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const { valueLink, link } = req.body;

    let links = await linksData();
    const linkToUpdate = links.find(link => link.id === id);

    if (linkToUpdate) {
        linkToUpdate.valueLink = valueLink;
        linkToUpdate.link = link;
        await saveData(links);
        res.json({ status: 201, message: "Link updated" });
    } else {
        res.json({ status: 400, message: "Error to updated link" });
    }
});

router.delete('/links/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        let links = await linksData();
        links = links.filter(link => link.id !== id);
        await saveData(links);
        res.json({ status: 201, message: "Link deleted" });
    } catch (error) {
        res.json({ status: 400, message: "Error to deleted link" });
    }
});

/* Login */

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verify user and password in database users.js
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({ username }, JWT_KEY, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ success: true, message: 'Login successful', token: token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

router.get('/logout', async (req, res) => {
    const clientIP = req.header('x-forwarded-for') || req.connection.remoteAddress;

    res.clearCookie('token');

    await deleteDataAuth(clientIP);
    
    res.status(201).json({ success: true, message: 'Logout successful' });
});

module.exports = router;