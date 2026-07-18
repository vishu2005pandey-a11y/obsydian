import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
