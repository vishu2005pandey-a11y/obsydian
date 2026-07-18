import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function clearProducts() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Load the models so they are registered with mongoose
    const ProductSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        images: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        sizes: [{ type: String }],
        colors: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        ratings: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
      },
      { timestamps: true }
    );
    
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    console.log("Deleting all products...");
    const result = await Product.deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} products.`);
    
    console.log("Database cleanup completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing products:", error);
    process.exit(1);
  }
}

clearProducts();
