export const setFirebaseProviderId = (value = "") => {
  localStorage.setItem("firebaseProviderId", value);
};

export const getFirebaseProviderId = () => {
  const providerId = localStorage.getItem("firebaseProviderId");

  return providerId || "none";
};
