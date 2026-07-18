import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'user' | 'admin';
  addresses: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    googleId: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
