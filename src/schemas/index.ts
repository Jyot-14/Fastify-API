import { Schema } from 'mongoose';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>({
  name: String,
  email: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
  createdAt: Date,
  updatedAt: Date,
});
