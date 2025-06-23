import { Navigate, Outlet } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Loading from "@/components/loading";

const PrivateRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
