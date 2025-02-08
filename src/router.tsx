import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login/Login";
import Dashboard from "./layouts/Dashboard";
import NoAuth from "./layouts/NoAuth";
import Root from "./layouts/Root";
import Users from "./pages/Users/Users";
import Tenants from "./pages/Tenants/Tenants";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dashboard />,
                children: [
                    {
                        path: '',
                        element: <HomePage />
                    },
                    {
                        path: '/users',
                        element: <Users />
                    },
                    {
                        path: '/restaurants',
                        element: <Tenants />,
                    },
                ]
            },
            {
                path: '/auth',
                element: <NoAuth />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />
                    }
                ]
            },
        ]
    }

])