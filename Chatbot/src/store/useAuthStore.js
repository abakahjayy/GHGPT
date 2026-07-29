import { create } from "zustand";

// Reads the persisted auth blob and splits it into { user, token }.
const getStoredAuth = () => {
    try {
        const raw = localStorage.getItem("user-info");
        if (!raw) return { user: null, token: null };
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && "user" in parsed) {
            return { user: parsed.user ?? null, token: parsed.token ?? null };
        }
        return { user: parsed, token: null };
    } catch {
        localStorage.removeItem("user-info");
        return { user: null, token: null };
    }
};

const { user: initialUser, token: initialToken } = getStoredAuth();

const useAuthStore = create((set) => ({
    user: initialUser,
    token: initialToken,
    isLoading: false,
    error: null,

    loginUser: (data) => set({ user: data?.user ?? data, token: data?.token ?? null }),

    logoutUser: () => {
        localStorage.removeItem("user-info");
        set({ user: null, token: null });
    },

    registerUser: (data) => set({ user: data?.user ?? data, token: data?.token ?? null }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setToken: (token) => set({ token }),

    // Updates just the user doc — leaves the existing token untouched.
    setAuthUser: (user) => set({ user }),
}));

export default useAuthStore;
// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//     user: JSON.parse(localStorage.getItem("user-info")), 
//     isLoading: false,
//     error: null,

//     // Login action
//     loginUser: (user) => set({ user }),

//     // Logout action
//     logoutUser: () => {
//         localStorage.removeItem("user-info"); // Clear local storage
//         set({ user: null });
//     },

//     // Register action
//     registerUser: (user) => set({ user }),

//     // Set loading state
//     setLoading: (loading) => set({ isLoading: loading }),

//     // Set error state
//     setError: (error) => set({ error }),

//     setAuthUser: (user) => set({ user }),
// }));

// export default useAuthStore;
