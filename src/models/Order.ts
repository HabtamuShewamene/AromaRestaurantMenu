import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
}

const OrderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [{
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

export default models.Order || model<IOrder>('Order', OrderSchema);
