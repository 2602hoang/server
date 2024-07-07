
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
  
      const hashedPassword = hashPassword(password);
  
      // Insert user data into the database
      const user = await Users.create({
        id_user: v4(),
        username,
        phone,
        password: hashedPassword,
        avatar: filedata ? filedata.path : null,
        id_role: roleId,
        // Avoid specifying id_user here to let Sequelize manage it
      });
  
      return res.status(200).json({ success: true, data: user });
  
    } catch (error) {
      console.error('Error adding user:', error);
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
    try{
        const {username,phone, password, id_role } = req.body;
        const { id_user } = req.params;
        const parsedIdUser = parseInt(id_user);
        if(isNaN(parsedIdUser)){
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await Users.findByPk(parsedIdUser);
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const hashedPassword = hashPassword(password);
        const updateData = {
            username,
            phone,
            password: hashedPassword,
            id_role
            
        }
    
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.avatar = result.secure_url;
        }

        await user.update(updateData);
        return res.status(200).json({ success: true, message: 'User updated successfully' });
    }catch(error){
        throw new Error(error);
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

