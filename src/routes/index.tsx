import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import App from "../App";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Jobs from "../pages/Jobs";
import JobsDetails from "../Components/JobsDetails";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../Components/ProtectedRoute";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: (
                    <App />
                ),
            },
            {
                path: "/login",
                element: (

                    <Login />

                ),
            },
            {
                path: "/signup",
                element: (

                    <Signup />

                ),
            },
             {
                path: "/dashboard",
                element: (

                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                    </ProtectedRoute>

                ),
            },
             {
                path: "/jobs",
                element: (

                    <Jobs />

                ),
            },
             {
                path: "/jobs/:id",
                element: (

                    <JobsDetails />

                ),
            },

            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
export default routes;