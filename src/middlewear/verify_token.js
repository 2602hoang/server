import jwt from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
    const access_token = req.headers.authorization;
    if (!access_token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const accessToken = access_token.split(' ')[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.decoded = decoded;
            // console.log(decoded);
            next();
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default verifyToken;


