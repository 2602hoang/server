import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const access_token = req.headers.authorization;
    console.log(access_token);
    if (!access_token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const accessToken = access_token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) 
            return res.status(401).json({ message: 'Unauthorized' });
          req.decoded = decoded;
        next();
    });
};

export default verifyToken;
