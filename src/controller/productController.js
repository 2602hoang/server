import { cloudinary } from "../middlewear/cloudianary.config.js";
import { Brand, Category, OrderDetail, Product } from "../module/index.js";
import sequelize from "../config/connectDB.js";

export async function getALlProductsOnSale(req, res) {
    try {
        const { rows: products } = await Product.findAndCountAll({
            where: {
                status: 0
            },
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
export async function getALlProductsDontSale(req, res) {
    try {
        const { rows: products } = await Product.findAndCountAll({
            where: {
                status: 1
            },
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

export async function getALlProducts(req, res) {
    try {
        const { rows: products } = await Product.findAndCountAll({
            order: [['status', 'ASC']],

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
        let {   name, description, id_category, id_brand,price, stock, discoust, images  } = req.body;
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
            name,
            description,
            id_category,
            id_brand,
            price,
            stock,
            discoust,
            images: filedata?.path
        });

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export async function updateProduct(req, res) {
    try {
      const { id_brand, id_category, name, description, price, stock, discoust } = req.body;
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
        stock,
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
    const transaction = await sequelize.transaction();
    try {
        const { id_product } = req.params;
        const parsedId = parseInt(id_product, 10);

        if (isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await Product.findByPk(parsedId, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const orderDetailExists = await OrderDetail.findOne({ where: { id_product: parsedId }, transaction });

        if (orderDetailExists) {
            product.status = 1;
            await product.save({ transaction });
        } else {
            product.status = 1;
            await product.save({ transaction });
        }

        await transaction.commit();
        return res.status(200).json({ success: true });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function reStockProduct(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { id_product } = req.params;
        const parsedId = parseInt(id_product, 10);

        if (isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await Product.findByPk(parsedId, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const orderDetailExists = await OrderDetail.findOne({ where: { id_product: parsedId }, transaction });

        if (orderDetailExists) {
            product.status = 0;
            await product.save({ transaction });
        }
        else {
            product.status = 0;
            await product.save({ transaction });
        }
        await transaction.commit();
        return res.status(200).json({ success: true });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
