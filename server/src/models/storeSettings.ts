import { Schema, model, Document } from "mongoose";

export interface IStoreSettings extends Document {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  shippingPrice: number;
  taxPercentage: number;
  supportEmail: string;
  supportPhone: string;
  location: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  aboutContent: string;
  privacyContent: string;
  termsContent: string;
}

const storeSettingsSchema = new Schema<IStoreSettings>(
  {
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "United States",
    },
    currencyCode: {
      type: String,
      required: [true, "Currency code is required"],
      trim: true,
      uppercase: true,
      default: "USD",
    },
    currencySymbol: {
      type: String,
      required: [true, "Currency symbol is required"],
      trim: true,
      default: "$",
    },
    exchangeRate: {
      type: Number,
      required: [true, "Exchange rate is required"],
      min: [0.01, "Exchange rate must be positive"],
      default: 1,
    },
    shippingPrice: {
      type: Number,
      min: [0, "Shipping price cannot be negative"],
      default: 0,
    },
    taxPercentage: {
      type: Number,
      min: [0, "Tax percentage cannot be negative"],
      max: [100, "Tax percentage cannot exceed 100"],
      default: 0,
    },
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    location: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    aboutContent: { type: String, default: "" },
    privacyContent: { type: String, default: "" },
    termsContent: { type: String, default: "" },
  },
  { timestamps: true }
);

const storeSettingsModel = model<IStoreSettings>(
  "StoreSettings",
  storeSettingsSchema
);

export default storeSettingsModel;
