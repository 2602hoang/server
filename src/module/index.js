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
  
  username: {
    type: DataTypes.STRING,
   
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone:{
    type: DataTypes.STRING,
 
  },
  password: {
    type: DataTypes.STRING,
    
  },
  remember_token: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  id_role: {
    type: DataTypes.INTEGER,
    references: {
      model: 'role',
      key: 'id_role',
    },
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

});

const Role = sequelize.define('role', {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
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
  tableName: 'role',
  
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
   
  },
  total_amount: {
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
  id_pay: {
    type: DataTypes.INTEGER,
    references: {
      model: 'pay',
      key: 'id_pay',
    },
  },
  id_adress: {
    type: DataTypes.INTEGER,
    references: {
      model: 'adress',
      key: 'id_adress',
    },
  },
  notes: {
    type: DataTypes.STRING,
  },
  note_pays:{
    type: DataTypes.STRING,
  },
  total_price: {
    type: DataTypes.FLOAT,
    
  },
  status: {
    type: DataTypes.TINYINT,
  },
  finished:{
    type: DataTypes.TINYINT,
  },
  date_order: {
    type: DataTypes.DATE,
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

  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  
  },
  images: {
    type: DataTypes.BOOLEAN,
  },
  stock: {
    type: DataTypes.INTEGER,
 
  },
  discoust: {
    type: DataTypes.FLOAT,
  },
  created_at: {
    type: DataTypes.DATE,
  
  },
  updated_at: {
    type: DataTypes.DATE,
   
  },
}, {
  tableName: 'product',
  
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
    
  },
  created_at: {
    type: DataTypes.DATE,
  
  },
  updated_at: {
    type: DataTypes.DATE,
   
  },
}, {
  tableName: 'category',

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
});
const Adress = sequelize.define('adress', {
  id_adress: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  
  },
  tableName: 'adress',

});

const Pay = sequelize.define('pay', {
  id_pay: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_pay: {
    type: DataTypes.STRING,
  },
  
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pay',
});


Users.belongsTo(Role, { foreignKey: 'id_role' });
Role.hasMany(Users, { foreignKey: 'id_role' });
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

Pay.hasMany(Order, { foreignKey: 'id_pay' });
Order.belongsTo(Pay, { foreignKey: 'id_pay' });

Adress.hasMany(Order, { foreignKey: 'id_adress' });
Order.belongsTo(Adress, { foreignKey: 'id_adress' });

export { Users, OrderDetail, Order, Product, Category, Brand ,Role ,Pay,Adress};
export default sequelize;
