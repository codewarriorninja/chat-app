import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


export const useAuthStore = create((set) => ({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in checkAuth store", error.message);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async (data) => {
        try {
            set({isSigningUp:true});
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in signup store", error.message);
        }finally{
            set({isSigningUp:false});
        }
    }
}));
