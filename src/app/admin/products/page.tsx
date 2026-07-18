"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, X, Upload } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", price: "", 
    category: "", sizes: "", colors: "", stock: "10", 
    isFeatured: false, images: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories")
    ]);
    if (prodRes.ok) setProducts(await prodRes.json());
    if (catRes.ok) setCategories(await catRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean)
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save product");
      
      toast.success("Product saved successfully!");
      setShowForm(false);
      setFormData({ name: "", slug: "", description: "", price: "", category: "", sizes: "", colors: "", stock: "10", isFeatured: false, images: [] });
      fetchData();
    } catch (error) {
      toast.error("Error saving product");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-white tracking-widest">PRODUCTS</h1>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "neon"}>
          {showForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Product</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#0a0a0a] border border-border rounded-xl p-6 mb-8 glow-border">
          <h2 className="text-lg text-white mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input placeholder="Slug (e.g. anime-tee-1)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              <Input placeholder="Price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              <Input placeholder="Stock Quantity" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
              
              <select className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" className="accent-primary w-4 h-4" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
                Featured Product
              </label>
            </div>

            <Input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Sizes (comma separated, e.g. S, M, L)" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
              <Input placeholder="Colors (comma separated, e.g. Black, White)" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} />
            </div>

            <div className="border border-border border-dashed rounded-lg p-6 flex flex-col items-center">
              <label className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-primary transition-colors">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Click to upload an image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
              {isUploading && <span className="text-xs text-primary mt-2">Uploading...</span>}
            </div>

            {formData.images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto py-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 border border-border rounded overflow-hidden shrink-0">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded p-1 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border mt-6">
              <Button type="submit" variant="neon" className="px-8">Save Product</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto w-full p-6">
            <div className="space-y-4">
              <div className="flex gap-4 border-b border-border pb-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-10 h-10 shrink-0" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No products found. Click "Add Product" to create one.</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-background border-b border-border text-gray-400 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 text-white">
                      <div className="w-10 h-10 bg-[#111] border border-border rounded overflow-hidden shrink-0">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{p.category?.name || '-'}</td>
                    <td className="px-6 py-4 text-white">₹{p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${p.stock > 10 ? 'bg-green-500/10 text-green-500' : p.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:text-red-300 p-2 min-h-[44px] min-w-[44px] transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
