import { Schema, model, Document } from "mongoose";

export interface IStoreSettings extends Document {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
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
  },
  { timestamps: true }
);

const storeSettingsModel = model<IStoreSettings>(
  "StoreSettings",
  storeSettingsSchema
);

export default storeSettingsModel;
