const { whiteList } = require('../Config/whitelistIp');

exports.checkRequest = async (req, res, next) => {
    const referer = req.get('referer');
    const isAllowed = whiteList.some((e) => referer && referer.startsWith(e));

    if (!isAllowed) {
        return res.status(403).json({ error: "Forbidden" });
    }

    next();
};
