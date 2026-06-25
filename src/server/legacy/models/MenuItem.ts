import mongoose, { Schema, model, models } from 'mongoose';

export interface IMenuItem {
  name: string;
  price: number;
  description: string;
  category: mongoose.Types.ObjectId | string;
  image: string;
  isAvailable: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);
