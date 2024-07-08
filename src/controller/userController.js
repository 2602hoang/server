
import { v4 } from 'uuid';
import { cloudinary } from '../middlewear/cloudianary.config.js';
import { Role, Users } from '../module/index.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
const hashPassword = (password) => {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
export async function getOne(req, res) {
    try {
        const { id_user } = req.params;
        const parsedIdUser = parseInt(id_user);
        if (isNaN(parsedIdUser)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }
        const user = await Users.findOne({ where: { id_user: parsedIdUser } });
       
        return res.status(200).json({ success: true,  user });
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAll(req, res) {
    try {
        const users = await Users.findAll({
            order: [
                ['id_role', 'ASC'] // Sắp xếp tăng dần theo id_role
            ]
        });
        return res.status(200).json(users);
    } catch (error) {
        throw new Error(error);
    }
}

export async function addUser(req, res) {
    try {
        const { username, phone, password, avatar, id_role } = req.body;
        const filedata = req.file;

        const roleId = parseInt(id_role);
        if (isNaN(roleId)) {
            if (filedata) {
                // Clean up uploaded file if role ID is invalid
                cloudinary.uploader.destroy(filedata.filename);
            }
            return res.status(400).json({ success: false, message: 'Invalid role ID' });
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            if (filedata) {
                // Clean up uploaded file if role ID is not found
                cloudinary.uploader.destroy(filedata.filename);
            }
            return res.status(400).json({ success: false, message: 'Role not found' });
        }

        // Check if phone number already exists
        const existingUser = await Users.findOne({ where: { phone } });
        if (existingUser) {
            if (filedata) {
                // Clean up uploaded file if phone number is not unique
                cloudinary.uploader.destroy(filedata.filename);
            }
            return res.status(400).json({ success: false, message: 'Phone number already exists' });
        }

        const hashedPassword = hashPassword(password);

        // Insert user data into the database
        const newUser = {
            id_user: v4(), // Generate a UUID for id_user
            username,
            phone,
            password: hashedPassword,
            avatar: filedata ? filedata.path : null,
            id_role: roleId,
        };

        const user = await Users.create(newUser);

        // Upload avatar to Cloudinary if filedata is available
        if (filedata) {
            const cloudinaryResponse = await cloudinary.uploader.upload(filedata.path);
            // Assuming cloudinaryResponse contains necessary information about the uploaded file
            // Update user's avatar field with Cloudinary URL or other relevant information
            user.avatar = cloudinaryResponse.secure_url; // Example: Storing Cloudinary URL
            await user.save(); // Save the updated user data with Cloudinary URL
        }

        return res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error('Error adding user:', error);
        
        // Clean up uploaded file if an error occurs during insertion
        if (filedata) {
            cloudinary.uploader.destroy(filedata.filename);
        }
        
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id_user } = req.params;
        const parsedIdUser = parseInt(id_user);
        if (isNaN(parsedIdUser)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }
        const user = await Users.findOne({ where: { id_user: parsedIdUser } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.destroy();
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateUser(req, res) {
    try {
        const { username, phone, password, id_role } = req.body;
        const { id_user } = req.params;
        const parsedIdUser = parseInt(id_user);

        if (isNaN(parsedIdUser)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await Users.findByPk(parsedIdUser);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the phone number already exists for another user
        const existingUserWithPhone = await Users.findOne({ where: { phone } });
        if (existingUserWithPhone && existingUserWithPhone.id_user !== parsedIdUser) {
            return res.status(409).json({ success: false, message: 'Phone number already exists' });
        }

        const hashedPassword = hashPassword(password);
        const updateData = {
            username,
            phone,
            password: hashedPassword,
            id_role
        };

        // Check if there's a new avatar file to upload
        if (req.file) {
            // Upload new avatar to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            // Delete old avatar from Cloudinary if it exists
            if (user.avatar) {
                const publicId = user.avatar.public_id; // Assuming you store public_id in the avatar field
                await cloudinary.uploader.destroy(publicId);
            }

            updateData.avatar = result.secure_url;
        }

        await user.update(updateData);
        return res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the user' });
    }
}
export async function getAllRole(req, res) {
    try {
        const roles = await Role.findAll({
            attributes: ['id_role', 'name'],
            where: {
                id_role: {
                    [Op.in]: [124,125]  // Include only roles with id_role 124 or 125
                }
            }
        });
        return res.status(200).json(roles);
    } catch (error) {
        throw new Error(error);
    }
}

