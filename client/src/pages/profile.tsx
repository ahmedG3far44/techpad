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

function formatAddr(a: IAddress): string {
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
}

function AddressForm({ address, onChange }: { address: IAddress; onChange: (a: IAddress) => void }) {
  const update = (field: keyof IAddress, value: string | boolean) =>
    onChange({ ...address, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          ["Label", "label", "select"],
          ["Country", "country", "text"],
          ["State / City", "state", "text"],
          ["Area / District", "area", "text"],
        ] as const).map(([label, field]) => (
          <div key={field}>
            <label className="block text-xs font-medium text-surface-500 mb-1">{label}</label>
            {field === "label" ? (
              <select
                value={address.label}
                onChange={(e) => update(field, e.target.value)}
                className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-surface-900"
              >
                {labelOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={address[field] as string}
                onChange={(e) => update(field, e.target.value)}
                placeholder={field === "state" ? "e.g. Cairo" : field === "area" ? "e.g. Maadi" : ""}
                className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 placeholder-surface-400"
              />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          ["Street Name", "street"],
          ["Building", "building"],
          ["Floor", "floor"],
          ["Apartment", "apartment"],
        ] as const).map(([label, field]) => (
          <div key={field}>
            <label className="block text-xs font-medium text-surface-500 mb-1">{label}</label>
            <input
              type="text"
              value={address[field] as string}
              onChange={(e) => update(field, e.target.value)}
              placeholder={field === "street" ? "Street name" : field === "building" ? "Building / Villa no." : field === "floor" ? "Floor number" : "Apt / Suite no."}
              className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 placeholder-surface-400"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">Phone (optional)</label>
        <input
          type="tel"
          value={address.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Delivery contact number"
          className="w-full px-2.5 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 placeholder-surface-400 max-w-xs"
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
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempProfile({ ...tempProfile, profileImage: reader.result });
      }
    };
    reader.readAsDataURL(file);
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

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-surface-300 border-t-primary-600" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SEO title="My Profile" description="Manage your profile and addresses." />
      <div className="py-8 sm:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">My Profile</h1>
            <p className="text-sm text-surface-500 mt-0.5">Manage your personal information and saved addresses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-surface-900">Personal Information</h2>
              <button
                onClick={toggleProfileEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {isEditingProfile ? (
                  <><FaX className="w-3 h-3" /> Cancel</>
                ) : (
                  <><FaEdit className="w-3.5 h-3.5" /> Edit</>
                )}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface-100 flex items-center justify-center overflow-hidden border-2 border-surface-200">
                {(isEditingProfile ? tempProfile.profileImage : profile.profileImage) ? (
                  <img
                    src={isEditingProfile ? tempProfile.profileImage : profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-10 h-10 text-surface-400" />
                )}
              </div>
              {isEditingProfile && (
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-primary-700 transition-colors">
                  <FaCamera className="w-3.5 h-3.5" />
                  {tempProfile.profileImage ? "Change Image" : "Upload Image"}
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isEditingProfile ? (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900"
                        value={tempProfile.firstName}
                        onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-500 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900"
                        value={tempProfile.lastName}
                        onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm bg-surface-50 text-surface-500 cursor-not-allowed"
                      value={tempProfile.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={saveProfileChanges}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <><FaSave className="w-3.5 h-3.5" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: FaUser, label: "Full Name", value: `${profile.firstName} ${profile.lastName}` },
                    { icon: FaMailBulk, label: "Email", value: profile.email },
                    { icon: FaPhone, label: "Phone", value: profile.phone || "Not set" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
                      <item.icon className="w-4 h-4 text-surface-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-surface-500">{item.label}</p>
                        <p className="text-sm font-medium text-surface-900 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-surface-900">Saved Addresses</h2>
                <p className="text-xs text-surface-500 mt-0.5">{addresses.length} {addresses.length === 1 ? "address" : "addresses"} on file</p>
              </div>
              <button
                onClick={() => setAdding(!adding)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {adding ? <><FaX className="w-3 h-3" /> Cancel</> : "+ Add Address"}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {adding && (
              <div className="mb-6 p-4 border border-surface-200 rounded-xl bg-surface-50">
                <h3 className="text-sm font-medium text-surface-900 mb-4">New Address</h3>
                <AddressForm address={newAddress} onChange={setNewAddress} />
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-800 transition-colors">Cancel</button>
                  <button onClick={saveNewAddress} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Save Address</button>
                </div>
              </div>
            )}

            {addresses.length === 0 && !adding ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                  <FaMapPin className="w-5 h-5 text-surface-400" />
                </div>
                <h3 className="text-sm font-semibold text-surface-800 mb-1">No addresses yet</h3>
                <p className="text-xs text-surface-500">Add a shipping address to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border p-4 transition-all ${
                      addr.isDefault
                        ? "border-primary-300 bg-primary-50"
                        : "border-surface-200 hover:border-surface-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          addr.label === "Home" ? "bg-emerald-100 text-emerald-700" :
                          addr.label === "Office" ? "bg-blue-100 text-blue-700" :
                          "bg-surface-100 text-surface-600"
                        }`}>
                          <FaMapPin className="w-2.5 h-2.5" />
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <FaStar className="w-2.5 h-2.5" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!addr.isDefault && (
                          <button onClick={() => setAsDefault(index)} className="p-1.5 text-surface-400 hover:text-amber-500 rounded-lg hover:bg-surface-100 transition-colors" title="Set as default">
                            <FaRegStar className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {editingIndex === index ? (
                          <button onClick={() => cancelEditAddress()} className="p-1.5 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100 transition-colors">
                            <FaX className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={() => startEditAddress(index)} className="p-1.5 text-surface-400 hover:text-primary-600 rounded-lg hover:bg-surface-100 transition-colors">
                            <FaEdit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeAddress(index)} className="p-1.5 text-surface-400 hover:text-red-500 rounded-lg hover:bg-surface-100 transition-colors">
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingIndex === index ? (
                      <>
                        <AddressForm address={editAddress} onChange={setEditAddress} />
                        <div className="flex justify-end mt-4">
                          <button onClick={() => saveEditAddress(index)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                            <FaSave className="w-3 h-3" /> Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-surface-800 leading-relaxed">{formatAddr(addr)}</p>
                        {addr.phone && <p className="text-xs text-surface-400">Phone: {addr.phone}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;
