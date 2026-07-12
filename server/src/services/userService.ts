import userModel from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import orderModel from "../models/order";
import { IAddress } from "../utils/types";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "user is already exist!!", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const userPayload = {
    id: newUser.id,
    firstName,
    lastName,
    email,
    isAdmin: newUser.isAdmin,
  };
  const token = generateToken(userPayload);

  return {
    data: {
      user: {
        ...userPayload,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        addresses: newUser.addresses,
      },
      token,
    },
    statusCode: 201,
  };
};

interface LoginParams {
  email: string;
  password: string;
}
export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    return { data: "this user not found!!", statusCode: 400 };
  }

  const correctPasswords = await bcrypt.compare(password, findUser.password);

  if (!correctPasswords) {
    return { data: "your email or password is wrong!!", statusCode: 400 };
  }
  const { id, firstName, lastName, isAdmin, addresses, phone, profileImage } =
    findUser;

  const userPayload = {
    id,
    firstName,
    lastName,
    email,
    isAdmin,
  };

  const token = generateToken(userPayload);
  return {
    data: {
      user: { ...userPayload, phone, profileImage, addresses },
      token,
    },
    statusCode: 200,
  };
};

interface GetUserProfileParams {
  userId: string;
}
export const getUserProfile = async ({ userId }: GetUserProfileParams) => {
  try {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return { data: "User not found", statusCode: 404 };
    }
    return {
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
      },
      statusCode: 200,
    };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface UpdateUserProfileParams {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}
export const updateUserProfile = async ({
  userId,
  firstName,
  lastName,
  phone,
  profileImage,
}: UpdateUserProfileParams) => {
  try {
    const updateData: Record<string, any> = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");
    if (!user) {
      return { data: "User not found", statusCode: 404 };
    }
    return {
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
      },
      statusCode: 200,
    };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface GetUserOrdersParams {
  userId: string;
}
export const getUserOrders = async ({ userId }: GetUserOrdersParams) => {
  try {
    const orders = await orderModel.find({ userId }).sort();
    return { data: { orders }, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

interface AddUserAddressParams {
  userId: string;
  address: IAddress;
}
export const addUserAddress = async ({
  userId,
  address,
}: AddUserAddressParams) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return { data: "User not found", statusCode: 404 };

    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();
    return { data: user.addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface UpdateUserAddressParams {
  userId: string;
  addressIndex: number;
  address: IAddress;
}
export const updateUserAddress = async ({
  userId,
  addressIndex,
  address,
}: UpdateUserAddressParams) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return { data: "User not found", statusCode: 404 };
    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return { data: "Address not found", statusCode: 404 };
    }

    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses[addressIndex] = address;
    await user.save();
    return { data: user.addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface SetDefaultAddressParams {
  userId: string;
  addressIndex: number;
}
export const setDefaultAddress = async ({
  userId,
  addressIndex,
}: SetDefaultAddressParams) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return { data: "User not found", statusCode: 404 };
    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return { data: "Address not found", statusCode: 404 };
    }

    user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses[addressIndex].isDefault = true;
    await user.save();
    return { data: user.addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface DeleteUserAddressParams {
  userId: string;
  addressIndex: number;
}
export const deleteUserAddress = async ({
  userId,
  addressIndex,
}: DeleteUserAddressParams) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return { data: "User not found", statusCode: 404 };
    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return { data: "Address not found", statusCode: 404 };
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return { data: user.addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface GetUserAddressesListParams {
  userId: string;
}
export const getUserAddressesList = async ({
  userId,
}: GetUserAddressesListParams) => {
  try {
    const user = await userModel.findById(userId);
    const addresses = user?.addresses;
    return { data: addresses, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface UpdateUserStatusPramsType {
  userId: string;
  newStatus: "active" | "blocked";
}
export const updateUserStatus = async ({
  userId,
  newStatus,
}: UpdateUserStatusPramsType) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true }
    );
    return { data: user, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

interface DeleteUserStatusPramsType {
  userId: string;
}
export const deleteUserStatus = async ({
  userId,
}: DeleteUserStatusPramsType) => {
  try {
    const user = await userModel.findByIdAndDelete(userId);
    return { data: user, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};

export interface GenerateTokenParams {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}
const generateToken = (payload: GenerateTokenParams) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
  return token;
};
