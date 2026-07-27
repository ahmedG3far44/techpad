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
  shippingPrice: number;
  taxPercentage: number;
  supportEmail?: string;
  supportPhone?: string;
  location?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  aboutContent?: string;
  privacyContent?: string;
  termsContent?: string;
}

export const updateSettings = async ({
  country,
  currencyCode,
  currencySymbol,
  exchangeRate,
  shippingPrice,
  taxPercentage,
  supportEmail,
  supportPhone,
  location,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  aboutContent,
  privacyContent,
  termsContent,
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
    settings.shippingPrice = shippingPrice;
    settings.taxPercentage = taxPercentage;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (supportPhone !== undefined) settings.supportPhone = supportPhone;
    if (location !== undefined) settings.location = location;
    if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
    if (tiktokUrl !== undefined) settings.tiktokUrl = tiktokUrl;
    if (aboutContent !== undefined) settings.aboutContent = aboutContent;
    if (privacyContent !== undefined) settings.privacyContent = privacyContent;
    if (termsContent !== undefined) settings.termsContent = termsContent;
    await settings.save();
    return { data: settings, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
