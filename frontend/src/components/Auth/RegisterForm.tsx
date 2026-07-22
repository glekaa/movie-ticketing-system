import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { RegisterFormValues } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/authSchemas";
import { FormInput } from "../Elements/FormElements";
import Button from "../Elements/Button";
import { useNavigate } from "react-router";
import authServices from "../../services/authServices";
import { Loader2 } from "lucide-react";
import useAuthStore from "../../stores/authStore";

const Register = () => {
    const navigate = useNavigate();
    const { login: storeLogin } = useAuthStore();

    const { mutateAsync: registerUser, isPending, isError, error } = useMutation({
        mutationFn: async (credentials: RegisterFormValues) => {
            const data = await authServices.register(credentials);
            storeLogin(data.user, data.token, data.refreshToken);
            return data;
        },
        onSuccess: (data) => {
            data.user?.role === "admin" ? navigate("/admin", { replace: true }) : navigate("/", { replace: true });
        }
    });

    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        await registerUser(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
                label="Email Address"
                type="email"
                placeholder="johndoe@example.com"
                error={errors.email?.message}
                disabled={isPending}
                {...register("email")}
            />
            <FormInput
                label="Username"
                placeholder="johnDoe"
                error={errors.username?.message}
                disabled={isPending}
                {...register("username")}
            />
            <FormInput
                label="Password"
                placeholder="••••••••"
                type="password"
                error={errors.password?.message}
                disabled={isPending}
                {...register("password")}
            />

            {isError && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                    {error instanceof Error ? error.message : "Failed to register. Please try again."}
                </div>
            )}

            <Button
                className="w-full py-3.5 mt-6 text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                disabled={isPending}
                type="submit"
                variant="primary"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                ) : "Sign Up"}
            </Button>
        </form>
    );
};

export default Register;