"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Upload, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      setSettings((prev: any) => ({ ...prev, [field]: data.url }));
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload image", { id: toastId });
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving settings...");
    
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroBgImage: settings.heroBgImage,
          animeCategoryBgImage: settings.animeCategoryBgImage,
          aboutBgImage: settings.aboutBgImage,
          homeCategoryOversizedBgImage: settings.homeCategoryOversizedBgImage,
          homeCategorySuperheroBgImage: settings.homeCategorySuperheroBgImage,
          aboutStoryImage: settings.aboutStoryImage,
          collectionAnimeBgImage: settings.collectionAnimeBgImage,
          collectionOversizedBgImage: settings.collectionOversizedBgImage,
          collectionVintageBgImage: settings.collectionVintageBgImage,
          collectionCyberpunkBgImage: settings.collectionCyberpunkBgImage,
          upiId: settings.upiId,
          upiQrImage: settings.upiQrImage,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update settings", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-serif tracking-widest text-white mb-8">SITE SETTINGS</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h1 className="text-2xl font-serif tracking-widest text-white">SITE SETTINGS</h1>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Payment Settings */}
        <h2 className="text-2xl font-serif tracking-widest text-white mt-12 border-b border-border pb-4">PAYMENT SETTINGS (UPI)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Merchant UPI ID</h2>
            <p className="text-gray-400 text-sm mb-4">Payments will be routed to this UPI ID.</p>
            <input 
              type="text"
              value={settings?.upiId || ""}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
              className="w-full bg-[#111] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              placeholder="e.g. merchant@upi"
            />
          </div>
          
          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">UPI QR Code Image</h2>
            <p className="text-gray-400 text-sm mb-4">This QR code will be shown to desktop users.</p>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.upiQrImage ? (
                <img src={settings.upiQrImage} alt="UPI QR" className="max-w-full max-h-full object-contain" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload QR
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "upiQrImage")} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif tracking-widest text-white mt-12 border-b border-border pb-4">HOMEPAGE IMAGES</h2>
        {/* Hero Background */}
        <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
          <h2 className="text-white text-lg font-medium mb-2">Homepage Hero Background</h2>
          <p className="text-gray-400 text-sm mb-4">This image appears at the very top of the homepage.</p>
          
          <div className="relative h-[300px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group">
            {settings?.heroBgImage ? (
              <img src={settings.heroBgImage} alt="Hero bg" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-600" />
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                <Upload className="w-4 h-4" /> Upload New Image
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "heroBgImage")} />
              </label>
            </div>
          </div>
        </div>

        {/* Anime Category Background */}
        <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
          <h2 className="text-white text-lg font-medium mb-2">Anime Category Background</h2>
          <p className="text-gray-400 text-sm mb-4">This image appears as the background for the Anime Tees category card on the homepage.</p>
          
          <div className="relative h-[300px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group">
            {settings?.animeCategoryBgImage ? (
              <img src={settings.animeCategoryBgImage} alt="Anime bg" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-600" />
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                <Upload className="w-4 h-4" /> Upload New Image
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "animeCategoryBgImage")} />
              </label>
            </div>
          </div>
        </div>

        {/* About Background */}
        <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
          <h2 className="text-white text-lg font-medium mb-2">About Page - Hero Background</h2>
          <p className="text-gray-400 text-sm mb-4">This image is used as the hero header on the About page.</p>
          
          <div className="relative h-[300px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group">
            {settings?.aboutBgImage ? (
              <img src={settings.aboutBgImage} alt="About bg" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-600" />
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                <Upload className="w-4 h-4" /> Upload New Image
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "aboutBgImage")} />
              </label>
            </div>
          </div>
        </div>
        
        {/* About Story Background */}
        <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
          <h2 className="text-white text-lg font-medium mb-2">About Page - Our Story Image</h2>
          <p className="text-gray-400 text-sm mb-4">The grayscale image next to the "Our Story" text.</p>
          
          <div className="relative h-[300px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group">
            {settings?.aboutStoryImage ? (
              <img src={settings.aboutStoryImage} alt="About story" className="w-full h-full object-cover grayscale" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-600" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                <Upload className="w-4 h-4" /> Upload New Image
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "aboutStoryImage")} />
              </label>
            </div>
          </div>
        </div>

        {/* Homepage Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Homepage - Oversized Category</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.homeCategoryOversizedBgImage ? (
                <img src={settings.homeCategoryOversizedBgImage} alt="Oversized" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "homeCategoryOversizedBgImage")} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Homepage - Superhero Category</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.homeCategorySuperheroBgImage ? (
                <img src={settings.homeCategorySuperheroBgImage} alt="Superhero" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "homeCategorySuperheroBgImage")} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Page Settings */}
        <h2 className="text-2xl font-serif tracking-widest text-white mt-12 border-b border-border pb-4">COLLECTIONS PAGE IMAGES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Anime Essentials</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.collectionAnimeBgImage ? (
                <img src={settings.collectionAnimeBgImage} alt="Anime Col" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "collectionAnimeBgImage")} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Oversized Hoodies</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.collectionOversizedBgImage ? (
                <img src={settings.collectionOversizedBgImage} alt="Oversized Col" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "collectionOversizedBgImage")} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Vintage Wash</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.collectionVintageBgImage ? (
                <img src={settings.collectionVintageBgImage} alt="Vintage Col" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "collectionVintageBgImage")} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-border p-6 rounded-xl">
            <h2 className="text-white text-lg font-medium mb-2">Cyberpunk Aesthetic</h2>
            <div className="relative h-[250px] bg-[#111] border border-border rounded-lg overflow-hidden flex items-center justify-center group mt-4">
              {settings?.collectionCyberpunkBgImage ? (
                <img src={settings.collectionCyberpunkBgImage} alt="Cyberpunk Col" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/30 transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "collectionCyberpunkBgImage")} />
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
