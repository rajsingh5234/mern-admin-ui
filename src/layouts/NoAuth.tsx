import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";

const NoAuth = () => {
    const { user } = useAuthStore();
    if (user !== null) {
        return <Navigate to="/" replace={true} />
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default NoAuth