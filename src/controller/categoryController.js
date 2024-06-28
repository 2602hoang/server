import { Category } from "../module/index.js";



export async function getAllCategories(req, res) {
    try {
        const categories = await Category.findAndCountAll(
            {attributes: ['id_category','name']}
        );
        return res.status(200).json(categories);
    } catch (error) {
        throw new Error(error);
    }
}