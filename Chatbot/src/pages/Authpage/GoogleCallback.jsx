import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import useAuthStore from "../../store/useAuthStore";
import useShowToast from "../../hooks/useShowToast";
import API from "../../utils/api";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const showToast = useShowToast();
    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        const verifyGoogleLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

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