import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import useAuthStore from "../../store/useAuthStore";
import useShowToast from "../../hooks/useShowToast";
import API from "../../utils/api";

// The backend's /auth/google/callback redirects here with ?token=... after
// a successful Google sign-in. This page's whole job is to:
//   1. Pull the token out of the URL and immediately scrub it from the
//      address bar (it should never sit visibly in the URL or history).
//   2. VERIFY the token actually works by requesting the user's own
//      dashboard data with it — never trust an unverified token as a
//      real session just because it showed up in a redirect.
//   3. On success, store { user, token } exactly the way normal
//      email/password login does, then go to the app.
//   4. On failure, show why, and send the user back to the login page.
export default function GoogleCallback() {
    const navigate = useNavigate();
    const showToast = useShowToast();
    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        const verifyGoogleLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            // Clear it from the URL right away, regardless of what happens next.
            window.history.replaceState({}, "", "/auth/callback");

            if (!token) {
                showToast("Error", "Google sign-in failed: no token received.", "error");
                navigate("/auth", { replace: true });
                return;
            }

            try {
                const { data } = await API.get("/api/v1/auth/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setToken(token);
                setAuthUser(data.user);
                localStorage.setItem("user-info", JSON.stringify({ user: data.user, token }));

                showToast("Success", "Logged in with Google", "success");
                navigate("/", { replace: true });
            } catch (error) {
                console.log(error);
                showToast("Error", "Google sign-in failed. Please try again.", "error");
                navigate("/auth", { replace: true });
            }
        };

        verifyGoogleLogin();
    }, []);

    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Spinner size="xl" />
        </Flex>
    );
}
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Flex, Spinner } from "@chakra-ui/react";
// import useAuthStore from "../../store/useAuthStore";
// import useShowToast from "../../hooks/useShowToast";
// import API from "../../utils/api";

// export default function GoogleCallback() {
//     const navigate = useNavigate();
//     const showToast = useShowToast();
//     const setAuthUser = useAuthStore((state) => state.setAuthUser);
//     const setToken = useAuthStore((state) => state.setToken);

//     useEffect(() => {
//         const verifyGoogleLogin = async () => {
//             const params = new URLSearchParams(window.location.search);
//             const token = params.get("token");

//             window.history.replaceState({}, "", "/auth/callback");

//             if (!token) {
//                 showToast("Error", "Google sign-in failed: no token received.", "error");
//                 navigate("/auth", { replace: true });
//                 return;
//             }

//             try {
//                 const { data } = await API.get("/api/v1/auth/dashboard", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 setToken(token);
//                 setAuthUser(data.user);
//                 localStorage.setItem("user-info", JSON.stringify({ user: data.user, token }));

//                 showToast("Success", "Logged in with Google", "success");
//                 navigate("/", { replace: true });
//             } catch (error) {
//                 console.log(error);
//                 showToast("Error", "Google sign-in failed. Please try again.", "error");
//                 navigate("/auth", { replace: true });
//             }
//         };

//         verifyGoogleLogin();
//     }, []);

//     return (
//         <Flex h="100vh" alignItems="center" justifyContent="center">
//             <Spinner size="xl" />
//         </Flex>
//     );
// }