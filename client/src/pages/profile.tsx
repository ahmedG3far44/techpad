import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaMapPin,
  FaTrash,
  FaSave,
  FaEdit,
  FaMailBulk,
  FaCamera,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

import Container from "../components/Container";
import useAuth from "../context/auth/AuthContext";
import { IAddress, emptyAddress } from "../utils/types";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const labelOptions: IAddress["label"][] = ["Home", "Office", "Other"];

interface AddressFormProps {
  address: IAddress;
  onChange: (a: IAddress) => void;
}

function AddressForm({ address, onChange }: AddressFormProps) {
  const update = (field: keyof IAddress, value: string | boolean) =>
    onChange({ ...address, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Label
          </label>
          <select
            value={address.label}
            onChange={(e) => update("label", e.target.value)}
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {labelOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Country
          </label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            State / City
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="e.g. Cairo"
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Area / District
          </label>
          <input
            type="text"
            value={address.area}
            onChange={(e) => update("area", e.target.value)}
            placeholder="e.g. Maadi"
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Street Name
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => update("street", e.target.value)}
            placeholder="Street name"
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Building
          </label>
          <input
            type="text"
            value={address.building}
            onChange={(e) => update("building", e.target.value)}
            placeholder="Building / Villa no."
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Floor
          </label>
          <input
            type="text"
            value={address.floor}
            onChange={(e) => update("floor", e.target.value)}
            placeholder="Floor number"
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">
            Apartment / Suite
          </label>
          <input
            type="text"
            value={address.apartment}
            onChange={(e) => update("apartment", e.target.value)}
            placeholder="Apt / Suite no."
            className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">
          Phone for this address (optional)
        </label>
        <input
          type="tel"
          value={address.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Delivery contact number"
          className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-xs"
        />
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, token, logUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profileImage: user?.profileImage || "",
  });
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({ ...emptyAddress(), isDefault: false });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editAddress, setEditAddress] = useState<IAddress>(emptyAddress());

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchAddresses();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      const p = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        profileImage: data.profileImage || "",
      };
      setProfile(p);
      setTempProfile(p);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load addresses");
      const data = await res.json();
      setAddresses(data || []);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setTempProfile({ ...tempProfile, profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleProfileEdit = () => {
    if (isEditingProfile) {
      setTempProfile({ ...profile });
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const saveProfileChanges = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: tempProfile.firstName,
          lastName: tempProfile.lastName,
          phone: tempProfile.phone,
          profileImage: tempProfile.profileImage,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "",
        profileImage: data.profileImage || "",
      });
      logUser({
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          profileImage: data.profileImage,
          isAdmin: data.isAdmin,
          addresses: data.addresses,
        },
        token: token!,
      });
      setIsEditingProfile(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveNewAddress = async () => {
    if (!newAddress.street.trim() || !newAddress.state.trim()) {
      toast.error("Street and State are required");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) throw new Error("Failed to add address");
      const data = await res.json();
      setAddresses(data || []);
      setNewAddress({ ...emptyAddress(), isDefault: false });
      setAdding(false);
      toast.success("Address added!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEditAddress = (index: number) => {
    setEditingIndex(index);
    setEditAddress({ ...addresses[index] });
  };

  const cancelEditAddress = () => {
    setEditingIndex(null);
  };

  const saveEditAddress = async (index: number) => {
    if (!editAddress.street.trim() || !editAddress.state.trim()) {
      toast.error("Street and State are required");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/address/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAddress),
      });
      if (!res.ok) throw new Error("Failed to update address");
      const data = await res.json();
      setAddresses(data || []);
      setEditingIndex(null);
      toast.success("Address updated!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const setAsDefault = async (index: number) => {
    try {
      const res = await fetch(`${BASE_URL}/user/address/${index}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to set default address");
      const data = await res.json();
      setAddresses(data || []);
      toast.success("Default address updated!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeAddress = async (index: number) => {
    try {
      const res = await fetch(`${BASE_URL}/user/address/${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete address");
      const data = await res.json();
      setAddresses(data || []);
      if (editingIndex === index) setEditingIndex(null);
      toast.success("Address removed!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatAddr = (a: IAddress): string => {
    const parts = [
      a.building && `Building ${a.building}`,
      a.floor && `Floor ${a.floor}`,
      a.apartment && `Apt ${a.apartment}`,
      a.street,
      a.area,
      a.state,
      a.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-surface-200 border-t-primary-600" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SEO title="My Profile" description="Manage your profile and addresses." />
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-surface-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-surface-900">
                  Profile Information
                </h2>
                <button
                  onClick={toggleProfileEdit}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isEditingProfile ? (
                    <>
                      <FaX className="w-3 h-3 mr-1.5" /> Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="w-3 h-3 mr-1.5" /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full bg-surface-100 flex items-center justify-center overflow-hidden border-2 border-surface-200">
                  {(isEditingProfile
                    ? tempProfile.profileImage
                    : profile.profileImage) ? (
                    <img
                      src={
                        isEditingProfile
                          ? tempProfile.profileImage
                          : profile.profileImage
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-surface-400" />
                  )}
                </div>
                {isEditingProfile && (
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-xl text-white text-sm cursor-pointer hover:bg-primary-700 transition-colors">
                    <FaCamera className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                {isEditingProfile ? (
                  <div aria-label="Profile form" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={tempProfile.firstName}
                          onChange={(e) =>
                            setTempProfile({ ...tempProfile, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={tempProfile.lastName}
                          onChange={(e) =>
                            setTempProfile({ ...tempProfile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50"
                        value={tempProfile.email}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={tempProfile.phone}
                        onChange={(e) =>
                          setTempProfile({ ...tempProfile, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={saveProfileChanges}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        {saving ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          <>
                            <FaSave className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="w-5 h-5 text-surface-400" />
                      <div>
                        <p className="text-xs text-surface-500">Full Name</p>
                        <p className="font-medium text-surface-900">
                          {profile.firstName} {profile.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMailBulk className="w-5 h-5 text-surface-400" />
                      <div>
                        <p className="text-xs text-surface-500">Email</p>
                        <p className="font-medium text-surface-900">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="w-5 h-5 text-surface-400" />
                      <div>
                        <p className="text-xs text-surface-500">Phone</p>
                        <p className="font-medium text-surface-900">
                          {profile.phone || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div role="region" aria-label="Saved addresses" className="p-6 border-t border-surface-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-surface-900">
                  Addresses
                </h2>
                <button
                  onClick={() => setAdding(!adding)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {adding ? "Cancel" : "Add Address"}
                </button>
              </div>

              {adding && (
                <div className="mb-6 p-4 border border-surface-200 rounded-xl bg-surface-50">
                  <h3 className="text-sm font-medium text-surface-900 mb-4">
                    New Address
                  </h3>
                  <AddressForm address={newAddress} onChange={setNewAddress} />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setAdding(false)}
                      className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNewAddress}
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {addresses.length === 0 && !adding && (
                <div className="text-center py-8 text-surface-500">
                  <FaMapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No addresses saved yet</p>
                </div>
              )}

              <div role="list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                  <div
                    role="listitem"
                    key={index}
                    className={`border rounded-xl p-4 transition-colors ${
                      addr.isDefault
                        ? "border-primary-300 bg-primary-50/50"
                        : "border-surface-200 hover:border-surface-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            addr.label === "Home"
                              ? "bg-emerald-100 text-emerald-700"
                              : addr.label === "Office"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-surface-100 text-surface-600"
                          }`}
                        >
                          <FaMapPin className="w-3 h-3" />
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            <FaStar className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setAsDefault(index)}
                            className="text-amber-500 hover:text-amber-600"
                            title="Set as default"
                          >
                            <FaRegStar className="w-4 h-4" />
                          </button>
                        )}
                        {editingIndex === index ? (
                          <button
                            onClick={() => cancelEditAddress()}
                            className="text-surface-400 hover:text-surface-600"
                          >
                            <FaX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditAddress(index)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {editingIndex === index ? (
                      <>
                        <AddressForm
                          address={editAddress}
                          onChange={setEditAddress}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            onClick={() => saveEditAddress(index)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                          >
                            <FaSave className="w-4 h-4" /> Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-surface-800 leading-relaxed">
                          {formatAddr(addr)}
                        </p>
                        {addr.phone && (
                          <p className="text-xs text-surface-400">
                            Phone: {addr.phone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;
