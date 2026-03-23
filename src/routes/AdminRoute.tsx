import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { Navigate } from "react-router-dom";
function AdminRoute({children}: {children: React.ReactNode}) {
  const currentUser = useSelector((state: RootState) => state.user.user);
  
  if(!currentUser || (currentUser.role !== "admin" && currentUser.role !== "moderator")) {
    return <Navigate to={"/"}/>
  }

    return (
    <>{children}</>
  )
}

export default AdminRoute