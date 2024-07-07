import { cloudinary } from "../middlewear/cloudianary.config.js";
import { Brand, Category, Product } from "../module/index.js";


export async function getALlProducts(req, res) {
    try {
        const { rows: products } = await Product.findAndCountAll({
            include: [
                { model: Category, attributes: ['id_category', 'name'] }, // Include the Category model
                { model: Brand, attributes: ['id_brand', 'name'] } // Include the Brand model with only 'name' attribute
            ]
        });
        return res.status(200).json(products); // Send only the products array
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export async function getOneProduct(req, res) {
    try {
        const { id_product } = req.params;
        const product = await Product.findOne({
            where: {
                id_product
            },
            include: [
                { model: Category, attributes: [ 'name'] }, // Include the Category model
                { model: Brand, attributes: ['name'] } // Include the Brand model with only 'name' attribute
            ]
        });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export async function getProductByCategoryId(req, res) {
    try {
        const { id_category } = req.params;
        const parsedIdCategory = parseInt(id_category);
        if (isNaN(parsedIdCategory)) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }
        const products = await Product.findAndCountAll(
            {
                where: {
                    id_category: req.params.id_category
                },
                include: [
                    { model: Category, attributes: ['name'] }, // Include the Category model
                    { model: Brand, attributes: ['name'] } // Include the Brand model with only 'name' attribute
                ]
            }
        );
        return res.status(200).json(products);
    } catch (error) {
        throw new Error(error);
    }
}
export async function getProductByBrandId(req, res) {
    try {
        const { id_brand } = req.params;

        // Validate the id_brand parameter
        const parsedIdBrand = parseInt(id_brand);
        if (isNaN(parsedIdBrand)) {
            return res.status(400).json({ success: false, message: 'Invalid brand ID' });
        }

        // Fetch products by brand ID, including related Category and Brand data
        const products = await Product.findAndCountAll({
            where: {
                id_brand: parsedIdBrand
            },
            include: [
                { model: Category, attributes: ['id_category', 'name'] }, // Include the Category model
                { model: Brand, attributes: ['id_brand', 'name'] } // Include the Brand model with 'id_brand' and 'name' attributes
            ]
        });

        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products by brand ID:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export async function addProduct(req, res) {
    try {
        
        // console.log('File data:', filedata);
        let { id_brand, id_category, name, description, price, images , qty, discoust } = req.body;
        const filedata = req.file;
        console.log('Request body:', req.body);

        id_brand = parseInt(id_brand);
        id_category = parseInt(id_category);

        
        console.log('Parsed id_brand:', id_brand);
        console.log('Parsed id_category:', id_category);

       
        if (isNaN(id_brand) || isNaN(id_category)) {
            console.error('Invalid brand or category ID');
            if(filedata){
                cloudinary.uploader.destroy(filedata.filename);
            }
            return res.status(400).json({ success: false, message: 'Invalid brand or category ID' });
        }

       
        const brand = await Brand.findByPk(id_brand);
        if (!brand) {
            if(filedata){
                cloudinary.uploader.destroy(filedata.filename);
            }
            console.error(`Brand with id ${id_brand} not found`);
            return res.status(400).json({ success: false, message: 'Brand not found' });
        }

       
        const category = await Category.findByPk(id_category);
        if (!category) {
            if(filedata){
                cloudinary.uploader.destroy(filedata.filename);
            }
            console.error(`Category with id ${id_category} not found`);
            return res.status(400).json({ success: false, message: 'Category not found' });
        }


        const product = await Product.create({
            id_brand,
            id_category,
            name,
            description,
            price,
            images: filedata?.path,
            qty,
            discoust
        });

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export async function updateProduct(req, res) {
    try {
      const { id_brand, id_category, name, description, price, qty, discoust } = req.body;
      const { id_product } = req.params; // Extract id_product from req.params
      const parsedId = parseInt(id_product, 10); // Parse id_product as an integer
  
      if (isNaN(parsedId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }
  
      // Find the product by id_product
      const product = await Product.findByPk(parsedId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      // Prepare update data with fields to be updated
      const updateData = {
        id_brand,
        id_category,
        name,
        description,
        price,
        qty,
        discoust
      };
  
      // Handle file upload to Cloudinary if req.file exists
      if (req.file) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        updateData.images = result.secure_url; // Store the secure URL in the 'images' field
    }
  
      // Update the product with the new data including the image URL
      await product.update(updateData);
  
      // Return success response with updated product data
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
export async function deleteProduct(req, res) {
    try {
        const { id_product } = req.params; // Ensure id_product is extracted from req.params
        const parsedId = parseInt(id_product, 10); // Parse id_product as an integer

        if (isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await Product.findByPk(parsedId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        await product.destroy();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
