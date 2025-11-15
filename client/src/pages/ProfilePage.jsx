import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import AddressForm from "../components/AddressForm";
import { MapPin, Plus, Edit2, Trash2, User, Save, X } from "lucide-react";
import TriangleLoader from "../components/TriangleLoader";

const ProfilePage = () => {
  const { auth, setAuth } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: auth?.name || "",
    email: auth?.email || "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const token = localStorage.getItem("jwt");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/address", {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAddressSave = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    try {
      const response = await Axios.delete(`/address/${addressId}`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setUpdatingProfile(true);
    try {
      const response = await Axios.put(
        "/profile",
        {
          name: profileData.name.trim(),
          email: profileData.email.trim(),
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        // Update auth context
        setAuth({
          ...auth,
          name: response.data.user.name,
          email: response.data.user.email,
        });
        setIsEditingProfile(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: auth?.name || "",
      email: auth?.email || "",
    });
    setIsEditingProfile(false);
  };

  // Update profileData when auth changes
  useEffect(() => {
    if (auth) {
      setProfileData({
        name: auth.name || "",
        email: auth.email || "",
      });
    }
  }, [auth]);

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TriangleLoader height="500px" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and addresses</p>
      </div>

      {/* User Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#A37478] border border-[#A37478] rounded-md hover:bg-[#A37478] hover:text-white transition-colors"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A37478] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A37478] focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updatingProfile}
                className="flex items-center gap-2 px-4 py-2 bg-[#A37478] text-white rounded-md hover:bg-[#8b686b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {updatingProfile ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updatingProfile}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#A37478]/10 rounded-full flex items-center justify-center">
              <User size={32} className="text-[#A37478]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {auth?.name || "User"}
              </h3>
              <p className="text-gray-600">{auth?.email || ""}</p>
            </div>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <button
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#A37478] text-white rounded-md hover:bg-[#8b686b] transition-colors"
          >
            <Plus size={18} />
            Add New Address
          </button>
        </div>

        {showAddressForm ? (
          <div className="px-6 py-6">
            <AddressForm
              address={editingAddress}
              isEdit={!!editingAddress}
              onSave={handleAddressSave}
              onCancel={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
            />
          </div>
        ) : (
          <div className="px-6 py-6">
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#A37478]/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-[#A37478]" />
                        <span className="font-semibold text-gray-900">
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-[#A37478]/10 text-[#A37478] rounded">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAddress(address);
                            setShowAddressForm(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Edit address"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete address"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-700 text-sm">
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && (
                        <p className="text-gray-700 text-sm">
                          {address.addressLine2}
                        </p>
                      )}
                      {address.landmark && (
                        <p className="text-gray-600 text-sm">
                          Near {address.landmark}
                        </p>
                      )}
                      <p className="text-gray-700 text-sm">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-gray-700 text-sm">
                        Phone: {address.phone}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded uppercase mt-2">
                        {address.addressType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No addresses saved yet</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="px-4 py-2 bg-[#A37478] text-white rounded-md hover:bg-[#8b686b] transition-colors"
                >
                  Add New Address
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

