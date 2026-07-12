import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

import userModel from "./models/user";
import categoryModel from "./models/category";
import productModel from "./models/product";
import storeSettingsModel from "./models/storeSettings";

const CATEGORIES = [
  { name: "Keyboards", description: "Mechanical and membrane keyboards for work and gaming", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop" },
  { name: "Mice", description: "Precision mice for productivity and gaming", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop" },
  { name: "Headsets", description: "Immersive audio headsets with noise cancellation", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop" },
  { name: "Monitors", description: "High-resolution monitors for every setup", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop" },
  { name: "Mousepads", description: "Premium mousepads with optimized surfaces", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop" },
  { name: "Cables", description: "High-quality cables and adapters", image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&h=400&fit=crop" },
  { name: "Webcams", description: "HD and 4K webcams for streaming and calls", image: "https://images.unsplash.com/photo-1587826080292-65e9a87a2c97?w=600&h=400&fit=crop" },
];

const PRODUCTS = [
  { title: "Mechanical RGB Keyboard", description: "Full-size mechanical keyboard with Cherry MX Blue switches, RGB backlighting, and aluminum frame.", price: 129.99, stock: 45, category: "Keyboards" },
  { title: "Wireless Slim Keyboard", description: "Ultra-slim Bluetooth keyboard with scissor switches, perfect for travel.", price: 59.99, stock: 78, category: "Keyboards" },
  { title: "60% Gaming Keyboard", description: "Compact 60% layout with hot-swappable switches and PBT keycaps.", price: 89.99, stock: 34, category: "Keyboards" },
  { title: "Ergonomic Vertical Mouse", description: "Vertical design reduces wrist strain, 6 programmable buttons, 4000 DPI.", price: 49.99, stock: 56, category: "Mice" },
  { title: "Wireless Gaming Mouse", description: "Ultra-light 58g wireless mouse with 26K DPI sensor and 70h battery.", price: 79.99, stock: 23, category: "Mice" },
  { title: "Ambidextrous Mouse", description: "Symmetric design for left and right-handed users, 8 buttons, RGB.", price: 39.99, stock: 67, category: "Mice" },
  { title: "Noise Cancelling Headset", description: "Over-ear wireless headset with active noise cancellation and 40h battery.", price: 199.99, stock: 15, category: "Headsets" },
  { title: "Gaming Headset", description: "Surround sound 7.1 gaming headset with detachable mic and memory foam.", price: 89.99, stock: 42, category: "Headsets" },
  { title: "In-Ear Monitors", description: "Professional in-ear monitors with dual drivers and detachable cable.", price: 149.99, stock: 28, category: "Headsets" },
  { title: "27\" 4K Monitor", description: "27-inch 4K UHD IPS monitor with HDR400 and USB-C connectivity.", price: 449.99, stock: 12, category: "Monitors" },
  { title: "Ultrawide Gaming Monitor", description: "34-inch curved ultrawide 1440p 165Hz gaming monitor.", price: 699.99, stock: 8, category: "Monitors" },
  { title: "Portable Monitor", description: "15.6-inch FHD portable monitor with USB-C, perfect for on-the-go.", price: 199.99, stock: 31, category: "Monitors" },
  { title: "Extended Desk Mat", description: "Large 90x40cm desk mat with stitched edges and water-resistant surface.", price: 29.99, stock: 100, category: "Mousepads" },
  { title: "Speed Gaming Mousepad", description: "Hard surface mousepad optimized for low-friction fast movements.", price: 24.99, stock: 85, category: "Mousepads" },
  { title: "Control Mousepad", description: "Cloth mousepad with textured surface for precise control.", price: 19.99, stock: 120, category: "Mousepads" },
  { title: "USB-C Braided Cable", description: "1.5m braided USB-C cable with 100W PD charging support.", price: 14.99, stock: 200, category: "Cables" },
  { title: "HDMI 2.1 Cable", description: "Premium HDMI 2.1 cable supporting 4K@120Hz, 48Gbps bandwidth.", price: 24.99, stock: 150, category: "Cables" },
  { title: "Cable Management Kit", description: "Complete cable management kit with clips, sleeves, and ties.", price: 19.99, stock: 90, category: "Cables" },
  { title: "4K Webcam", description: "4K webcam with autofocus, built-in ring light, and noise-reducing mic.", price: 129.99, stock: 25, category: "Webcams" },
  { title: "HD Webcam", description: "1080p webcam with wide-angle lens, privacy shutter, and plug-and-play.", price: 49.99, stock: 60, category: "Webcams" },
];

const ADMIN_USERS = [
  { firstName: "Admin", lastName: "User", email: "admin@techpad.com", password: "Admin123!", isAdmin: true },
  { firstName: "Super", lastName: "Admin", email: "superadmin@techpad.com", password: "Admin123!", isAdmin: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      productModel.deleteMany({}),
      categoryModel.deleteMany({}),
      userModel.deleteMany({ isAdmin: true }),
    ]);
    await storeSettingsModel.deleteMany({});
    console.log("Cleared existing data");

    // Create categories
    const createdCategories = await categoryModel.insertMany(CATEGORIES);
    console.log(`Created ${createdCategories.length} categories`);

    const categoryMap = new Map(createdCategories.map((c) => [c.name, c]));

    // Create products
    const productData = PRODUCTS.map((p) => {
      const category = categoryMap.get(p.category)!;
      const images = [
        `https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop`,
      ];
      return {
        title: p.title,
        description: p.description,
        categoryId: category._id,
        categoryName: category.name,
        thumbnail: images[0],
        images,
        price: p.price,
        stock: p.stock,
        totalSales: 0,
        ordersCount: 0,
      };
    });

    const createdProducts = await productModel.insertMany(productData);
    console.log(`Created ${createdProducts.length} products`);

    // Update category product counts
    for (const product of createdProducts) {
      await categoryModel.findByIdAndUpdate(product.categoryId, {
        $inc: { numberOfProducts: 1 },
      });
    }

    // Create admin users
    for (const admin of ADMIN_USERS) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await userModel.create({
        ...admin,
        password: hashedPassword,
        status: "active",
        addresses: [],
      });
    }
    console.log(`Created ${ADMIN_USERS.length} admin users`);

    // Create default store settings
    await storeSettingsModel.create({
      country: "United States",
      currencyCode: "USD",
      currencySymbol: "$",
      exchangeRate: 1,
    });
    console.log("Created default store settings");

    console.log("\n✅ Seed completed successfully!");
    console.log("   - 7 categories");
    console.log(`   - ${createdProducts.length} products`);
    console.log(`   - ${ADMIN_USERS.length} admin users`);
    console.log("\nAdmin credentials:");
    console.log("   Email: admin@techpad.com / Password: Admin123!");
    console.log("   Email: superadmin@techpad.com / Password: Admin123!");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
