import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  heroBgImage: string;
  animeCategoryBgImage: string;
  aboutBgImage: string;
  homeCategoryOversizedBgImage: string;
  homeCategorySuperheroBgImage: string;
  aboutStoryImage: string;
  collectionAnimeBgImage: string;
  collectionOversizedBgImage: string;
  collectionVintageBgImage: string;
  collectionCyberpunkBgImage: string;
  upiId: string;
  upiQrImage: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema(
  {
    heroBgImage: { type: String, default: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2070&auto=format&fit=crop" },
    animeCategoryBgImage: { type: String, default: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop" },
    aboutBgImage: { type: String, default: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" },
    
    homeCategoryOversizedBgImage: { type: String, default: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop" },
    homeCategorySuperheroBgImage: { type: String, default: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=800&auto=format&fit=crop" },
    
    aboutStoryImage: { type: String, default: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop" },
    
    collectionAnimeBgImage: { type: String, default: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop" },
    collectionOversizedBgImage: { type: String, default: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop" },
    collectionVintageBgImage: { type: String, default: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop" },
    collectionCyberpunkBgImage: { type: String, default: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop" },
    
    upiId: { type: String, default: "test@upi" },
    upiQrImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
