import { Brand } from "../module/index.js";


export async function getALlBrands(req, res) {
    try {
        const brands = await Brand.findAndCountAll(
            {attributes: ['id_brand','name']}
        );
        return res.status(200).json(brands);
    } catch (error) {
        throw new Error(error);
    }
}
