import { Brand, Category, Product } from "../module/index.js";


export async function getALlProducts(req, res) {
    try {
        const products = await Product.findAndCountAll(
            // {
            //     attributes: {exclude: ['id_brand','id_category']},
            // },
            {include: [
                // { model: Product, attributes: ['id_product','name','description','price','images','qty','discoust','created_at','updated_at'] },
                { model: Category, attributes: ['id_category','name'] }, // Include the Category model
                { model: Brand, attributes: ['id_brand','name'] } // Include the Brand model with only 'name' attribute
            ]},
            

        );
        return res.status(200).json(products);
    } catch (error) {
        throw new Error(error);
    }
}