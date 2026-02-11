import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { LoginService } from '../services/AuthService';
import ErrMsg from '../compenet/ErrMsg';
const Login = () => {
    const [userData,setUserData] = useState({
      email:"",
      password:"",
    });
    const navigate = useNavigate()
    const [errMsg,setErrMsg] = useState({})



    const handleChange = (e)=>{
      const {name,value} = e.target
      setUserData({...userData,[name]:value})
    }

    
    
    const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErrMsg({})
      await LoginService(userData,setErrMsg,navigate);
    } catch (err) {
        console.log(err);
    }
};

  return (
    <div className="min-h-screen bg-[#90b4ce]/10 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#90b4ce]/20 overflow-hidden">
        <div className="bg-[#094067] p-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            FAB<span className="text-[#3da9fc]">FLOW</span>
          </h1>
          <p className="text-[#90b4ce] text-xs mt-2 font-medium uppercase tracking-widest">
            Gestion Industrielle B2B
          </p>
        </div>

        
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#094067] mb-6 text-center">
            Ravi de vous revoir !
          </h2>
          <form onSubmit={(e)=>handleLogin(e)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6c7b] uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#90b4ce]" size={18} />
                <input 
                    value={userData.email}
                    onChange={handleChange}
                    type="email" 
                    name='email'
                    placeholder="admin@fabflow.ma"
                    className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-xl focus:border-[#3da9fc] outline-none text-sm transition-all"
                    required
                />
                <ErrMsg msg={errMsg.errors?.email?.[0]} />
              </div>
            </div>

           
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6c7b] uppercase ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#90b4ce]" size={18} />
                <input 
                    value={userData.password}
                    name='password'
                    onChange={handleChange}
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-[#f8fafc] border border-[#90b4ce]/30 rounded-xl focus:border-[#3da9fc] outline-none text-sm transition-all"
                    required
                />
                <ErrMsg msg={errMsg.errors?.password?.[0]} />
                <ErrMsg msg={errMsg.errors?.incorrect?.[0]} />
                <button 
                    type="submit"
                    className="absolute right-3 top-3 text-[#90b4ce] hover:text-[#094067]"
                >
                </button>
              </div>
            </div>

            
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#5f6c7b] cursor-pointer">
                <input type="checkbox" className="accent-[#3da9fc]" /> Se souvenir de moi
              </label>
              <a href="#" className="text-[#3da9fc] font-bold hover:underline">Mot de passe oublié ?</a>
            </div>

            
            <button
              type="submit"
              className="w-full bg-[#3da9fc] hover:bg-[#094067] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#3da9fc]/20 transition-all transform active:scale-[0.98]"
            >
              Se connecter
            </button>
          </form>
          <p className="mt-8 text-center text-[#90b4ce] text-[10px] font-medium uppercase tracking-wider">
            Propulsé par FabFlow Engineering v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;