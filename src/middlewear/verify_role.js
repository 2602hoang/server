
export default function isAdmin(req, res, next) {
    const { role } = req.decoded;
    if (role !== 124 && role !== 125) {
        return res.status(403).json({ message: 'Quản Lý mới dùng được' });
    }
    next();
} 
export default function isStaff(req, res, next) {
    const { role } = req.decoded;
    if (role !== 123 && role !== 125) {
        return res.status(403).json({ message: 'Nhân Viên mới dùng được' });
    }
    next();
}
export default function isCustomer(req, res, next) {
    const { role } = req.decoded;
    if (role !== 123 && role !== 124) {
        return res.status(403).json({ message: 'Khách hàng mới dùng được' });
    }
    next();
}