import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { Star, Truck, ShieldCheck } from "lucide-react";

export const revalidate = 60; // revalidate every minute

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  await dbConnect();
  
  const product = await Product.findOne({ slug: decodedSlug }).populate("category", "name slug").lean();
  
  if (!product) {
    notFound();
  }

  // Serialize MongoDB ObjectId
  const serializedProduct = {
    ...product,
    price: Number(product.price) || 0,
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    _id: product._id.toString(),
    category: product.category ? {
      ...(product.category as any),
      _id: (product.category as any)._id ? (product.category as any)._id.toString() : product.category.toString(),
    } : null,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6 flex gap-2 items-center">
          <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            {(serializedProduct.category as any)?.name}
          </span>
          <span>/</span>
          <span className="text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">{serializedProduct.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Images (approx 40%) */}
          <div className="lg:w-[40%] flex flex-col gap-4">
            <div className="aspect-[4/5] bg-white/5 rounded-xl overflow-hidden border border-border">
              {(serializedProduct.images && serializedProduct.images.length > 0) ? (
                <img src={serializedProduct.images[0]} alt={serializedProduct.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
              )}
            </div>
            
            {(serializedProduct.images && serializedProduct.images.length > 1) && (
              <div className="grid grid-cols-4 gap-3">
                {serializedProduct.images.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors">
                    <img src={img} alt={`${serializedProduct.name} ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Middle Column: Details (approx 35%) */}
          <div className="lg:w-[35%] flex flex-col pt-2">
            <h1 className="text-2xl md:text-3xl font-medium text-white mb-2 leading-tight">
              {serializedProduct.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="flex text-primary">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= (serializedProduct.ratings || 5) ? 'fill-current' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm text-primary hover:underline cursor-pointer">12 Ratings & Reviews</span>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-semibold text-white">₹{serializedProduct.price.toFixed(2)}</span>
                {serializedProduct.discountPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{serializedProduct.discountPrice.toFixed(2)}</span>
                )}
                {serializedProduct.discountPrice && (
                  <span className="text-green-500 font-medium text-sm mb-1">
                    {Math.round(((serializedProduct.discountPrice - serializedProduct.price) / serializedProduct.discountPrice) * 100)}% off
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-3">Product Description</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {serializedProduct.description}
              </p>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <Truck className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-white text-sm">Free Delivery</h4>
                  <p className="text-xs text-gray-400 mt-1">Delivery by tomorrow if ordered in next 2 hrs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-white text-sm">1 Year Warranty</h4>
                  <p className="text-xs text-gray-400 mt-1">Brand warranty for device and 6 months for accessories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Box (approx 25%) */}
          <div className="lg:w-[25%]">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 sticky top-24">
              <div className="mb-4">
                <span className="text-xl font-semibold text-white">₹{serializedProduct.price.toFixed(2)}</span>
                <p className="text-green-500 text-sm font-medium mt-1">In Stock</p>
                <p className="text-xs text-gray-400 mt-1">Sold by RetailNet and Fulfilled by Yanshu.</p>
              </div>

              <AddToCartButton product={serializedProduct} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
