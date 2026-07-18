import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    qty: number;
    size?: string;
    color?: string;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'verifying';
  paymentMethod: 'UPI' | 'COD';
  orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true, min: 1 },
        size: { type: String },
        color: { type: String },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'verifying'], default: 'pending' },
    paymentMethod: { type: String, enum: ['UPI', 'COD'], required: true },
    orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
