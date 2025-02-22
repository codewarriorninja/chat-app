import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = 'http://localhost:5001'

export const useAuthStore = create((set,get) => ({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get.connectSocket();
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
            toast.success('Account created successfully');
            get.connectSocket();
        } catch (error) {
            toast.error("Error in signup store", error.message);
        }finally{
            set({isSigningUp:false});
        }
    },

    logout:async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success('Logged out successfully');
            get.disconnectSocket();
        } catch (error) {
            toast.error("Error in logout store", error.message);
        }finally{
            set({isCheckingAuth:false});
        }
    },
    login:async(data) => {
        try {
            set({isLoggingIn:true});
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser:res.data});
            toast.success('Logged in successfully');
            get().connectSocket();
        } catch (error) {
            toast.error("Error in login store", error.message);
        }finally{
            set({isLoggingIn:false});
        }
    },
    updateProfile:async(data) => {
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser:res.data});
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log('error in updateProfile store', error.message);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket: async() =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connect) return;
     const socket = io(BASE_URL,{
        query:{
            userId:authUser._id,
        }
     });
     socket.connect();
     set({socket:socket});
     socket.on('getOnlineUsers', (userIds) => {
       set({onlineUsers:userIds});
     })
    },
    disconnectSocket:async() =>{
     if(get().socket?.connect) get().socket.disconnect();
    }
}));
