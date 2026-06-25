import { Schema, model, models } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'CLIENT';
  image?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['ADMIN', 'CLIENT'], default: 'CLIENT' },
  image: { type: String },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
