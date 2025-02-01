import { Outlet } from "react-router-dom"


const NoAuth = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default NoAuth