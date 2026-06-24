import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "../hooks/useSignUp";
import GenericInput from "../Components/Input";
import { GenericButton } from "../Components/Button";
import Form from "../Components/Form";
import Alert from "../Components/Alert";

type FormData = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
};

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  const { mutate, isPending } = useSignUp();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        alert("Signup successful!");
        navigate("/login");
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
    <Form title="Enter your details to Signup">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md mx-auto"
      >
        <GenericInput
          name="firstName"
          type="text"
          label="First Name"
          placeholder="Provide your first name..."
          register={register("firstName", {
            required:
              "First name is required and can have max. 100 characters!",
            maxLength: { value: 100, message: "Max 100 characters allowed" },
          })}
        />

        <GenericInput
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Provide your last name..."
          register={register("lastName", {
            maxLength: { value: 100, message: "Max 100 characters allowed" },
          })}
        />

        <GenericInput
          name="email"
          type="email"
          label="Email"
          placeholder="Provide your email..."
          register={register("email", {
            required: "Email in correct format is required!",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format",
            },
          })}
        />

        <GenericInput
          name="password"
          type="password"
          label="Password"
          placeholder="Provide a password..."
          register={register("password", {
            required:
              "Password can be of 8-20 characters and must contain one uppercase, one lowercase, one number and one special character!",
            minLength: { value: 8, message: "Min 8 characters required" },
            maxLength: { value: 20, message: "Max 20 characters allowed" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              message:
                "Must include uppercase, lowercase, number & special character",
            },
          })}
        />

        {Object.keys(errors).length > 0 && (
          <Alert>
            <ul className="list-disc list-inside space-y-1 text-red-500 text-sm">
              {errors.firstName && <li>{errors.firstName.message}</li>}
              {errors.email && <li>{errors.email.message}</li>}
              {errors.password && <li>{errors.password.message}</li>}
            </ul>
          </Alert>
        )}

        <GenericButton type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </GenericButton>
      </form>
    </Form>
  );
}
