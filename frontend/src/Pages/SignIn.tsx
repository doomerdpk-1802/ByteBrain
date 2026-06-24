import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import Form from "../Components/Form";
import GenericInput from "../Components/Input";
import { GenericButton } from "../Components/Button";
import Alert from "../Components/Alert";
import type { LoginFormData, LoginResponse } from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: "onTouched" });

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (response: LoginResponse) => {
        alert("Signin successful!");
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMsg =
          error.response?.data?.error ||
          "Something went wrong. Please try again later.";

        alert(errorMsg);
      },
    });
  };

  return (
    <Form title="Enter your details to Login">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md mx-auto"
      >
        <GenericInput
          name="email"
          type="email"
          label="Email"
          placeholder="Provide your email..."
          register={register("email", {
            required: "Email is required!",
          })}
        />

        <GenericInput
          name="password"
          type="password"
          label="Password"
          placeholder="Provide a password..."
          register={register("password", {
            required: "Password is Required!",
          })}
        />

        {Object.keys(errors).length > 0 && (
          <Alert>
            <ul className="list-disc list-inside space-y-1 text-red-500 text-sm">
              {errors.email && <li>{errors.email.message}</li>}
              {errors.password && <li>{errors.password.message}</li>}
            </ul>
          </Alert>
        )}

        <GenericButton type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </GenericButton>
      </form>
    </Form>
  );
}
