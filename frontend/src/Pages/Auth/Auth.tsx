import { Link } from "react-router";
import LoginForm from "../../components/Auth/LoginForm"
import RegisterForm from "../../components/Auth/RegisterForm"
import { Clapperboard } from "lucide-react";

type AuthProps = {
    mode: "login" | "register";
}

const Auth = ({ mode }: AuthProps) => {

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden px-4">
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#00A3FF]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md bg-[#121111]/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl animate-scale-up space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-[#00A3FF] flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
                        <Clapperboard className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] tracking-wide text-white">
                        {mode === "login" ? "Welcome Back" : "Join the Absolute"}
                    </h1>
                    <p className="text-xs text-gray-400">
                        {mode === "login" ? "Sign into your account" : "Create your account"}
                    </p>
                </div>

                {mode === "login" ? <LoginForm /> : <RegisterForm />}
                <div className="flex gap-1 items-center justify-center text-xs pt-4 border-t border-white/5">
                    {mode === "login" ?
                        <>
                            <span className="text-gray-400">Don't have an account?</span>
                            <Link to="/auth/register" className="text-[#00A3FF] hover:underline font-semibold transition-all">
                                Register
                            </Link>
                        </>
                        :
                        <>
                            <span className="text-gray-400">Already have an account?</span>
                            <Link to="/auth/login" className="text-[#00A3FF] hover:underline font-semibold transition-all">
                                Sign In
                            </Link>
                        </>}
                </div>
            </div>
        </main >
    )
}

export default Auth;