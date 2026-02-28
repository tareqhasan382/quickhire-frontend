import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import App from "../App";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Jobs from "../pages/Jobs";

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
                path: "/jobs",
                element: (

                    <Jobs />

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