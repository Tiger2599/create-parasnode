const rateLimit = require('express-rate-limit');
const blockedIps = new Map();

function checkBlockedIps(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    console.log("🚀 ~ blockedIps:", blockedIps)

    if (blockedIps.has(ip)) {
        const unblockTime = blockedIps.get(ip);
        if (now < unblockTime) {
            const retryAfter = Math.ceil((unblockTime - now) / 1000);
            res.set('Retry-After', retryAfter);
            return res.send({
                status:"Error",
                msg:"",
                data:[],
                errors:new Array({ msg: 'Too many requests from this IP.' })
            })
        } else {
            blockedIps.delete(ip);
        }
    }
    
    next();
}

const appLimiter = rateLimit({
    windowMs: 1000,
    max: 3,
    handler: (req, res) => {
        const ip = req.ip;
        const unblockTime = Date.now() + 10 * 60 * 1000;
        blockedIps.set(ip, unblockTime);

        res.set('Retry-After', 600);
        return res.send({
            status:"Error",
            msg:"",
            data:[],
            errors:new Array({ msg: 'Too many requests from this IP.' })
        })
    }
});

module.exports = { checkBlockedIps, appLimiter };
