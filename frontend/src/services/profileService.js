import api from "@/services/api";


/*
 * ============================================================
 * Get Student Profile
 * ============================================================
 */

export const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};


/*
 * ============================================================
 * Update Student Profile
 * ============================================================
 */

export const updateProfile = async (profileData) => {
  const response = await api.put(
    "/profile",
    profileData
  );

  return response.data;
};