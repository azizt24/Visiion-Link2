import axios from "axios";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{

    const navigate = useNavigate();


    const login = async (inputs) =>{

        try{
            await axios.post('https://vision-link-api.onrender.com/auth/login', inputs)
            .then( async (res)=>{
                await localStorage.setItem('userToken', res.data.token);
                await localStorage.setItem('userId', res.data.user._id);
                await localStorage.setItem('userName', res.data.user.username);
                await localStorage.setItem('userEmail', res.data.user.email);
                navigate('/');
            }).catch((err) =>{
                console.log(err);
            });

        }catch(err){
            console.log(err);
        }
    }



    const register = async (inputs) =>{

        try{
            await axios.post('https://vision-link-api.onrender.com/auth/register', inputs)
            .then( async (res)=>{
                await localStorage.setItem('userToken', res.data.token);
                await localStorage.setItem('userId', res.data.user._id);
                await localStorage.setItem('userName', res.data.user.username);
                await localStorage.setItem('userEmail', res.data.user.email);
                navigate('/');
            }).catch((err) =>{
                console.log(err);
            });

        }catch(err){
            console.log(err);
        }
    }




    const logout = async () =>{
        localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
    }


    

    return(
        <AuthContext.Provider value={{login, register, logout}}>{children}</AuthContext.Provider>
    )


}
