import { Schema, model, models } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  image?: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

export default models.Category || model<ICategory>('Category', CategorySchema);
