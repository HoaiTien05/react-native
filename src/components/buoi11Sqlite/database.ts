//file myDatabase.db nằm ở /data/data/com.libraryappsqlite/databases/myDatabase.db
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};
export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  img: string;
};
export type Order = {
  id: number;
  user_id: number;
  total: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  payment_method: string;
  created_at: string;
  status: string;
};


const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];
const initialProducts: Product[] = [
    { id: 1, name: 'Áo sơ mi', price: 250000, img: 'hinh1.jpg', categoryId: 1 },
    { id: 2, name: 'Giày sneaker', price: 1100000, img: 'hinh1.jpg', categoryId: 2 },
    { id: 3, name: 'Balo thời trang', price: 490000, img: 'hinh1.jpg', categoryId: 3 },
    { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: 'hinh1.jpg', categoryId: 4 },
    { id: 5, name: 'Túi xách nữ', price: 980000, img: 'hinh1.jpg', categoryId: 5 },
  ];

//async: Khai báo đây là một hàm bất đồng bộ, cho phép sử dụng await bên trong
// onSuccess?: () => void: Tham số truyền vào là một callback tùy chọn, gọi khi quá trình khởi tạo thành công.
// Promise<void>: Hàm trả về một Promise, không trả giá trị cụ thể (kiểu void), nhằm đảm bảo có thể chờ quá trình khởi tạo hoàn tất.
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction((tx) => {

      // -------------------- CATEGORIES --------------------
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)'
      );
      initialCategories.forEach((category) => {
        tx.executeSql(
          'INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)',
          [category.id, category.name]
        );
      });

      // -------------------- PRODUCTS --------------------
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          img TEXT,
          categoryId INTEGER,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);

      initialProducts.forEach((product) => {
        tx.executeSql(
          'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
          [product.id, product.name, product.price, product.img, product.categoryId]
        );
      });

      // -------------------- REMOVE OLD ORDERS TABLE --------------------
      // tx.executeSql("DROP TABLE IF EXISTS orders");  // ⭐ ĐÚNG VỊ TRÍ

      // -------------------- USERS --------------------
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          role TEXT
        )`,
        [],
        () => console.log('✅ Users table created'),
        (_, error) => console.error('❌ Error creating users table:', error)
      );

      tx.executeSql(
        `INSERT INTO users (username, password, role)
         SELECT 'admin', '123456', 'admin'
         WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
        [],
        () => console.log('✅ Admin user added')
      );

      // -------------------- CART --------------------
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `);

      // -------------------- ORDERS (NEW SCHEMA) --------------------
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          total REAL,
          fullname TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          payment_method TEXT,
          created_at TEXT,
          status TEXT DEFAULT 'Chờ xử lý'
        )
      `);

      // -------------------- ORDER ITEMS --------------------
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          price REAL
        )
      `);

    },
    (error) => console.error('❌ Transaction error:', error),
    () => {
      console.log('✅ Database initialized');
      onSuccess && onSuccess();
    });

  } catch (error) {
    console.error('❌ initDatabase outer error:', error);
  }
};

 
  export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM categories');
    const items: Category[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM products');
    const items: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId]
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
};

export const updateProduct = async (product: Product) => {
    try {
      const database = await getDb();
      await database.executeSql(
        'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
        [product.name, product.price, product.categoryId, product.img, product.id]
      );
      console.log('✅ Product updated with image');
    } catch (error) {
      console.error('❌ Error updating product:', error);
    }
  };
 
export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.executeSql('DELETE FROM products WHERE id = ?', [id]);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};
//---------------lọc sản phẩm theo loại------
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM products WHERE categoryId = ?',
      [categoryId]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};

//tìm kiếm sản phẩm theo tên sản phẩm hoặc theo tên loại
export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `
      SELECT products.* FROM products
      JOIN categories ON products.categoryId = categories.id
      WHERE products.name LIKE ? OR categories.name LIKE ?
      `,
      [`%${keyword}%`, `%${keyword}%`]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error searching by name or category:', error);
    return [];
  }
};
//------------------crud user-----------------
// ➕ Thêm người dùng
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('✅ User added');
    return true; // Thêm thành công
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false; // Thêm thất bại
  }
};


// 🔄 Cập nhật người dùng
export const updateUser = async (user: User) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [user.username, user.password, user.role, user.id]
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  }
};

// ❌ Xóa người dùng theo id
export const deleteUser = async (id: number) => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
    console.log('✅ User deleted');
  } catch (error) {
    console.error('❌ Error deleting user:', error);
  }
};

// 🔍 Lấy danh sách tất cả người dùng
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users');
    const users: User[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      users.push(rows.item(i));
    }
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

// 🔑 Lấy người dùng theo username & password (dùng cho đăng nhập)
export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user by credentials:', error);
    return null;
  }
};

// 🔍 Lấy người dùng theo id
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user by id:', error);
    return null;
  }
};

// 🔍 lọc sản phẩm theo khoảng giá
export const filterProductsByPrice = async (min: number, max: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM products WHERE price BETWEEN ? AND ?',
      [min, max]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error filtering by price:', error);
    return [];
  }
};

//CẬP NHẬT THÔNG TIN USER
export const updateUserProfile = async (
  id: number,
  username: string,
  password: string
) => {
  const db = await getDb();
  await db.executeSql(
    'UPDATE users SET username=?, password=? WHERE id=?',
    [username, password, id]
  );
};
// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId: number, productId: number) => {
  const db = await getDb();
  const [result] = await db.executeSql(
    'SELECT * FROM cart WHERE user_id=? AND product_id=?',
    [userId, productId]
  );

  if (result.rows.length > 0) {
    const item = result.rows.item(0);
    await db.executeSql(
      'UPDATE cart SET quantity = quantity + 1 WHERE id=?',
      [item.id]
    );
  } else {
    await db.executeSql(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, 1]
    );
  }
};

// Xem giỏ hàng
export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const db = await getDb();
  const [result] = await db.executeSql(`
    SELECT cart.*, products.name, products.price, products.img
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `, [userId]);

  const items: CartItem[] = [];
  const rows = result.rows;
  for (let i = 0; i < rows.length; i++) {
    items.push(rows.item(i));
  }
  return items;
};

//Lịch sử đơn hàng
// export type Order = {
//   id: number;
//   total: number;
//   created_at: string;
// };

export const fetchOrders = async (userId: number): Promise<Order[]> => {
  const db = await getDb();
  const [result] = await db.executeSql(
    'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',
    [userId]
  );

  const orders: Order[] = [];
  const rows = result.rows;
  for (let i = 0; i < rows.length; i++) {
    orders.push(rows.item(i));
  }
  return orders;
};
// Xóa giả hàng
export const clearCart = async (userId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE user_id=?', [userId]);
};
//Xóa sản phẩm 
export const removeCartItem = async (cartId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE id=?', [cartId]);
};
//Cập nhật số lượng
export const updateCartQuantity = async (cartId: number, quantity: number) => {
  const db = await getDb();
  await db.executeSql('UPDATE cart SET quantity=? WHERE id=?', [quantity, cartId]);
};

// Đặt hàng/checkout
export const checkout = async (
  userId: number,
  customerInfo?: { fullname: string; email: string; phone: string; address: string },
  paymentMethod: string = 'Thanh toán khi nhận hàng'
) => {
  const db = await getDb();
  const cart = await fetchCart(userId);

  if (cart.length === 0) throw new Error('Giỏ hàng trống');

  const total = cart.reduce((sum, item) => sum + item.price! * item.quantity, 0);
  const now = new Date().toISOString();

  const [orderResult] = await db.executeSql(
    `INSERT INTO orders 
      (user_id, total, fullname, email, phone, address, payment_method, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      total,
      customerInfo?.fullname ?? '',
      customerInfo?.email ?? '',
      customerInfo?.phone ?? '',
      customerInfo?.address ?? '',
      paymentMethod,
      now,
    ]
  );

  const orderId = orderResult.insertId;

  for (const item of cart) {
    await db.executeSql(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, item.quantity, item.price]
    );
  }

  await clearCart(userId);
};
// Lấy tất cả đơn hàng (cho admin)
export const fetchAllOrders = async (): Promise<(Order & { status: string })[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    const orders: (Order & { status: string })[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      orders.push(rows.item(i));
    }
    return orders;
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    return [];
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE orders SET status = ? WHERE id = ?',
      [newStatus, orderId]
    );
    console.log('✅ Order status updated');
  } catch (error) {
    console.error('❌ Error updating order status:', error);
  }
};

