import storeSettingsModel from "../models/storeSettings";

export const getSettings = async () => {
  try {
    let settings = await storeSettingsModel.findOne();
    if (!settings) {
      settings = await storeSettingsModel.create({
        country: "United States",
        currencyCode: "USD",
        currencySymbol: "$",
        exchangeRate: 1,
      });
    }
    return { data: settings, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

interface UpdateSettingsParams {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
}

export const updateSettings = async ({
  country,
  currencyCode,
  currencySymbol,
  exchangeRate,
}: UpdateSettingsParams) => {
  try {
    let settings = await storeSettingsModel.findOne();
    if (!settings) {
      settings = new storeSettingsModel();
    }
    settings.country = country;
    settings.currencyCode = currencyCode.toUpperCase();
    settings.currencySymbol = currencySymbol;
    settings.exchangeRate = exchangeRate;
    await settings.save();
    return { data: settings, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
