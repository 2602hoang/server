// Importing necessary modules from Sequelize
import {  DataTypes } from 'sequelize';
import sequelize from '../config/connectDB.js';

// Defining the User model
const Users = sequelize.define('user', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remember_token: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user',
  timestamps: false,
});

// Defining the OrderDetail model
const OrderDetail = sequelize.define('order_detail', {
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_order: {
    type: DataTypes.INTEGER,
    references: {
      model: 'order',
      key: 'id_order',
    },
  },
  id_product: {
    type: DataTypes.INTEGER,
    references: {
      model: 'product',
      key: 'id_product',
    },
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'order_detail',
  timestamps: false,
});

// Defining the Order model
const Order = sequelize.define('order', {
  id_order: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id_user',
    },
  },
  notes: {
    type: DataTypes.STRING,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
  },
  date_order: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'order',
  timestamps: false,
});

// Defining the Product model
const Product = sequelize.define('product', {
  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_brand: {
    type: DataTypes.INTEGER,
    references: {
      model: 'brand',
      key: 'id_brand',
    },
  },
  id_category: {
    type: DataTypes.INTEGER,
    references: {
      model: 'category',
      key: 'id_category',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  images: {
    type: DataTypes.BOOLEAN,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discoust: {
    type: DataTypes.FLOAT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'product',
  timestamps: false,
});

// Defining the Category model
const Category = sequelize.define('category', {
  id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'category',
  timestamps: false,
});

// Defining the Brand model
const Brand = sequelize.define('brand', {
  id_brand: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'brand',
  timestamps: false,
});


// User hasMany Orders
Users.hasMany(Order, { foreignKey: 'id_user' });
Order.belongsTo(Users, { foreignKey: 'id_user' });

// Order hasMany OrderDetails
Order.hasMany(OrderDetail, { foreignKey: 'id_order' });
OrderDetail.belongsTo(Order, { foreignKey: 'id_order' });

// Product hasMany OrderDetails
Product.hasMany(OrderDetail, { foreignKey: 'id_product' });
OrderDetail.belongsTo(Product, { foreignKey: 'id_product' });

// Category hasMany Products
Category.hasMany(Product, { foreignKey: 'id_category' });
Product.belongsTo(Category, { foreignKey: 'id_category' });

// Brand hasMany Products
Brand.hasMany(Product, { foreignKey: 'id_brand' });
Product.belongsTo(Brand, { foreignKey: 'id_brand' });

export { Users, OrderDetail, Order, Product, Category, Brand };
export default sequelize;
