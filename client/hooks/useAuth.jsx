import useAuthStore from "../src/store/authStore";

const useAuth = () => {
  const { auth, setAuth, admin, setAdmin, clearAuth, clearAdmin } = useAuthStore();
  return { auth, setAuth, admin, setAdmin, clearAuth, clearAdmin };
};

export default useAuth;
