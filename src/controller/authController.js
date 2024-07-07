
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Users } from '../module/index.js';


const hashPassword = (password) => {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
export async function loginUser(req, res) {
    const { phone, password } = req.body;

    try {
        // Validate input
        if (!phone || !password) {
            return res.status(400).json({
                error: 3,
                mes: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        // Function to find user and validate password
        const loginUser1 = async ({ phone, password }) => {
            try {
                const user = await Users.findOne({ where: { phone }, raw: true });
                if (!user) {
                    return {
                        error: 1,
                        mes: 'Phone không tìm thấy',
                        access_token: null
                    };
                }

                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return {
                        error: 2,
                        mes: 'Sai mật khẩu',
                        access_token: null
                    };
                }

                // Generate JWT token
                const token = jwt.sign(
                    { id_user: user.id_user, phone: user.phone , id_role: user.id_role },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '2d' }
                );

                // Update user's remember_token in database
                await Users.update({ remember_token: token }, { where: { id_user: user.id_user } });

                return {
                    error: 0,
                    mes: 'Đăng nhập thành công',
                    access_token: token
                };

            } catch (error) {
                throw new Error(error.message); // Rethrow the error for consistent handling
            }
        };

        // Call the login function
        const loginResponse = await loginUser1({ phone, password });
        return res.status(200).json(loginResponse);

    } catch (error) {
        return res.status(500).json({
            error: 4,
            mes: 'Đăng nhập thất bại',
            details: error.message
        });
    }
}

export async function registerUser(req, res) {
    const { phone, username, password } = req.body;

    try {
        // Check if required fields are present
        if (!phone || !username || !password) {
            return res.status(400).json({
                error: 1,
                mes: 'Vui lòng nhập đầy đủ thông tin'
            });
        }
    const registerUser1 = ({username, phone, password  }) => new Promise(async (resolve, reject) => {
        try {
            const [user, created] = await Users.findOrCreate({
                where: { phone },
                defaults: {
                    username,
                    phone,
                    password: hashPassword(password),
                    id_role : 125,
                    id_user: v4()
                }
            });

            if (created) {
                const token = jwt.sign(
                    { id_user: user.id_user, phone: user.phone },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '2d' }
                );
                //   user.remember_token = token;
                //     await user.save();

                resolve({
                    error: 0,
                    mes: 'Đăng ký thành công',
                    token: token
                });
            } else {
                resolve({
                    error: 2,
                    mes: 'Trùng số điện thoại',
                    token: null
                });
            }
        } catch (error) {
            reject(error);
        }
    });


        const result = await registerUser1({ phone, username, password });
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, mes: 'Đăng ký thất bại ' });
    }
}

export async function updateUser(req, res) {
    try {
        const {username, avatar} = req.body;
        const id_user = req.params.id_user;
        console.log(id_user);
        if(!id_user){
            return res.status(400).json({
                error: 1,
                mes: 'khong tim thay user'
            });
        }
            await Users.update({ username, avatar }, { where: { id_user } });
            return res.status(200).json({
                error: 0,
                mes: 'cap nhat thanh cong'
            });
    } catch (error) {
        return res.status(500).json({
            error: 2,
            mes: 'cap nhat that bai',
            details: error.message
        });
    }
        
             
}