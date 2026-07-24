import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
  numberOfProducts: number;
  categorySales: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    numberOfProducts: {
      type: Number,
      default: 0,
      min: [0, "Number of products cannot be negative"],
    },
    categorySales: {
      type: Number,
      default: 0,
      min: [0, "Category sales cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// categorySchema.index({ name: 1 });

const categoryModel = model<ICategory>("Category", categorySchema);

export default categoryModel;
