import { col, fn, literal, Op } from "sequelize";
import sequelize, {
  Order,
  OrderDetail,
  Product,
  Users,
} from "../module/index.js"; // Adjust the import path as needed

export async function thongkeProductbyStock(req, res) {
  try {
    const products = await Product.findAndCountAll({
      where: {
        status: 0,
        stock: {
          [Op.lte]: 123, // Stock greater than or equal to 30
        },
      },
      attributes: ["stock", "name", "id_product"], // Select only the stock attribute
    });
    return res.status(200).json(products); // Send the products array
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// số lượng sản phẩm bán
export async function thongkeProductSales(req, res) {
  try {
    const orders = await Order.findAll({
      where: {
        [Op.and]: [
          {
            id_pay: {
              [Op.or]: [2, 3, 5],
            },
          },
          {
            finished: 1,
          },
        ],
      },
      attributes: ["id_order"],
      include: [
        {
          model: OrderDetail,
          attributes: ["id_product", "qty"],
          include: [
            {
              model: Product,
              attributes: ["name", "price", "images"], // Removed the extra comma
            },
          ],
        },
      ],
    });

    // Tính tổng số lượng sản phẩm bán ra theo sản phẩm
    const detailsMap = {};
    orders.forEach((order) => {
      order.order_details.forEach((detail) => {
        const { id_product, qty } = detail;
        const { name, price, images } = detail.product;

        if (detailsMap[id_product]) {
          detailsMap[id_product].so_luong += qty;
        } else {
          detailsMap[id_product] = {
            id_product,
            name,
            so_luong: qty,
            price,
            images,
          };
        }
      });
    });

    // Chuyển đổi và sắp xếp các chi tiết theo số lượng giảm dần
    const details = Object.values(detailsMap).sort(
      (a, b) => b.so_luong - a.so_luong
    );

    return res.status(200).json(details);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
//
export async function thongkeProductnoSales(req, res) {
  try {
    // Tìm các đơn hàng có id_pay = 5 và finished = 0
    const orders = await Order.findAll({
      where: {
        id_pay: 5,
        finished: 0,
      },
      attributes: ["id_order"],
      include: [
        {
          model: OrderDetail,
          attributes: ["id_product", "qty"],
          include: [
            {
              model: Product,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    // Chuyển đổi dữ liệu để có dạng mong muốn
    const detailsMap = orders.reduce((acc, order) => {
      order.order_details.forEach((detail) => {
        if (acc[detail.id_product]) {
          acc[detail.id_product].qty += detail.qty;
        } else {
          acc[detail.id_product] = {
            so_luong: detail.qty,
            id_product: detail.id_product,
            name: detail.product.name,
          };
        }
      });
      return acc;
    }, {});

    // Chuyển đổi và sắp xếp các chi tiết
    const details = Object.values(detailsMap).sort((a, b) => a.qty - b.qty);

    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// thống kê tổng đơn thành công // tổng tiền thu được // tổng số lượng sản phẩm bán ra
export async function thongkeThanhCong(req, res) {
  try {
    const successfulOrders = await Order.count({
      where: {
        id_pay: 2,
        finished: 1,
      },
    });

    const result = await Order.findAll({
      where: {
        id_pay: 2,
        finished: 1,
      },
      attributes: ["id_order"],
      include: [
        {
          model: OrderDetail,
          attributes: [
            [fn("SUM", col("order_details.qty")), "total_quantity"],
            [fn("SUM", col("order_details.total_amount")), "total_price"],
          ],
        },
      ],
      group: ["order.id_order"],
      raw: true,
    });
    // Total count of successful orders, retrieved from COUNT(id_order) alias 'count1'
    const totalQuantity = result.reduce(
      (acc, row) => acc + parseInt(row["order_details.total_quantity"] || 0),
      0
    ); // Tổng số lượng sản phẩm đã bán
    const totalRevenue = parseFloat(
      result.reduce(
        (acc, row) => acc + parseFloat(row["order_details.total_price"] || 0),
        0
      )
    ); // Tổng doanh thu

    return res.status(200).json({
      successfulOrders,
      totalQuantity,
      totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// thống kê tổng số đơn hủy // tổng tiền hủy // tổng số lượng sp hủy ra
export async function thongkeHuy(req, res) {
  try {
    const successfulOrders = await Order.count({
      where: {
        id_pay: 5,
        finished: 1,
      },
    });

    const result = await Order.findAll({
      where: {
        id_pay: 5,
        finished: 1,
      },
      attributes: ["id_order"],
      include: [
        {
          model: OrderDetail,
          attributes: [
            [fn("SUM", col("order_details.qty")), "total_quantity"],
            [fn("SUM", col("order_details.total_amount")), "total_price"],
          ],
        },
      ],
      group: ["order.id_order"],
      raw: true,
    });
    // Total count of successful orders, retrieved from COUNT(id_order) alias 'count1'
    const totalQuantity = result.reduce(
      (acc, row) => acc + parseInt(row["order_details.total_quantity"] || 0),
      0
    ); // Tổng số lượng sản phẩm đã bán
    const totalRevenue = parseFloat(
      result.reduce(
        (acc, row) => acc + parseFloat(row["order_details.total_price"] || 0),
        0
      )
    ); // Tổng doanh thu

    return res.status(200).json({
      successfulOrders,
      totalQuantity,
      totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// thống kê tổng đơn thất bại // tổng tiền thất bại // tổng số lượng sản phẩm thất bại
export async function thongkeThatbai(req, res) {
  try {
    const successfulOrders = await Order.count({
      where: {
        id_pay: 3,
        finished: 1,
      },
    });

    const result = await Order.findAll({
      where: {
        id_pay: 3,
        finished: 1,
      },
      include: [
        {
          model: OrderDetail,
          attributes: [
            // 'id_product',
            [fn("SUM", col("qty")), "total_quantity"],
            [fn("SUM", col("total_amount")), "total_price"],
          ],
        },
      ],
      group: ["order.id_order"],
      raw: true,
    });
    // Total count of successful orders, retrieved from COUNT(id_order) alias 'count1'
    const totalQuantity = result.reduce(
      (acc, row) => acc + parseInt(row["order_details.total_quantity"] || 0),
      0
    ); // Tổng số lượng sản phẩm đã bán
    const totalRevenue = parseFloat(
      result.reduce(
        (acc, row) => acc + parseFloat(row["order_details.total_price"] || 0),
        0
      )
    ); // Tổng doanh thu

    return res.status(200).json({
      successfulOrders,
      totalQuantity,
      totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// thống kê tổng số tài khoản

export async function thongkeUsers(req, res) {
  try {
    const totalUsers = await Users.count();

    const { count: activeCount, rows: activeUsers } =
      await Users.findAndCountAll({
        where: {
          status: 0,
        },
        attributes: ["id_user", "username", "phone", "avatar", "status"],
      });

    const { count: inactiveCount, rows: inactiveUsers } =
      await Users.findAndCountAll({
        where: {
          status: 1,
        },
        attributes: ["id_user", "username", "phone", "avatar", "status"],
      });

    // Chuyển đổi danh sách thành mảng đối tượng
    const activeUserDetails = activeUsers.map((user) => ({
      id_user: user.id_user,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
    }));

    const inactiveUserDetails = inactiveUsers.map((user) => ({
      id_user: user.id_user,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
    }));

    // In ra các thông tin người dùng
    // console.log("Total Users:", totalUsers);
    // console.log("Active User Count:", activeCount);
    // console.log("Active Users:", activeUserDetails);
    // console.log("Inactive User Count:", inactiveCount);
    // console.log("Inactive Users:", inactiveUserDetails);

    return res.status(200).json({
      totalUsers,
      activeCount,
      inactiveCount,
      activeUsers: activeUserDetails,
      inactiveUsers: inactiveUserDetails,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
}

// thống kê 3 tài khoản có nhiều đơn hàng nhát

export async function thongkeOrderbyUser(req, res) {
  try {
    let { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "Vui lòng cung cấp đầy đủ ngày bắt đầu và ngày kết thúc.",
      });
    }

    // Chuyển đổi ngày bắt đầu và ngày kết thúc từ string sang đối tượng Date
    start_date = new Date(start_date);
    end_date = new Date(end_date);

    // Kiểm tra xem ngày kết thúc có lớn hơn ngày bắt đầu không
    if (end_date <= start_date) {
      return res
        .status(400)
        .json({ error: "Ngày kết thúc phải lớn hơn ngày bắt đầu." });
    }

    console.log("start_date:", start_date);
    console.log("end_date:", end_date);

    // Query to find top 3 users by order count and their total spent amount
    const topUsers = await Order.findAll({
      where: {
        finished: 1, // Completed orders
        date_order: {
          [Op.between]: [start_date, end_date],
        },
      },
      attributes: [
        "id_user",
        [sequelize.fn("COUNT", sequelize.col("order.id_order")), "orderCount"],
        [sequelize.fn("SUM", sequelize.col("order.total_price")), "totalSpent"],
      ],
      include: [
        {
          model: Users,
          attributes: ["id_user", "username", "phone"],
          where: {
            status: 0, // Assuming status 0 means active users
          },
        },
      ],
      group: ["order.id_user", "user.id_user", "user.username", "user.phone"],
      order: [[sequelize.literal("orderCount"), "DESC"]],
      limit: 3,
    });

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
