const { loadDataAuth, saveDataAuth } = require("../helpers/helpers");

const sessionMiddleware = (req, res, next) => {
    let activeSessions = loadDataAuth();

    const clientIP = req.header('x-forwarded-for') || req.connection.remoteAddress;

    if (activeSessions.includes(clientIP)) {
        return res.redirect('/login');
    }

    activeSessions.push(clientIP);
    saveDataAuth(activeSessions);

    next();
}

module.exports = { sessionMiddleware };