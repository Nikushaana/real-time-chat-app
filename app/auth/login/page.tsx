"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const router = useRouter();

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<Record<string, string>>({});

  // validation
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
        "Please enter a valid email address (e.g., user@example.com)."
      ),

    password: Yup.string()
      .required("Password is required.")
      .min(6, "Password must be at least 6 characters long."),
  });

  const handleLoginValidation = () => {
    loginSchema
      .validate(loginValues, { abortEarly: false })
      .then(() => {
        setLoginError({});
        handleLogin();
      })
      .catch((err) => {
        if (err instanceof Yup.ValidationError) {
          const newErrors: Record<string, string> = {};
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          setLoginError(newErrors);

          Object.values(newErrors).forEach((msg) => {
            toast.error(msg, { autoClose: 3000 });
          });
        } else {
          toast.error("Unexpected validation error", { autoClose: 3000 });
        }
      });
  };

  // login functionality
  const handleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginValues.email.trim(),
      password: loginValues.password,
    });

    if (error) {
      toast.error("Login failed", { autoClose: 3000 });
      toast.error(
        "If you are already registered, Please Check it for confirmation",
        { autoClose: 5000 }
      );
      setLoginLoading(false);

      return;
    }

    toast.success("Logged in successfully!", { autoClose: 2000 });
    router.push("/dashboard/users");
    setLoginLoading(false);
  };

  return (
    <div
      className={`w-full flex flex-col gap-y-[10px] ${
        loginLoading && "pointer-events-none opacity-[0.7]"
      }`}
    >
      <InputWithLabel
        title="Email"
        name="email"
        setValue={setLoginValues}
        error={loginError.email}
      />
      <InputWithLabel
        title="Password"
        name="password"
        setValue={setLoginValues}
        isPassword={true}
        error={loginError.password}
      />
      <p
        onClick={() => {
          router.push("/auth/signup");
        }}
        className="underline self-end cursor-pointer text-[15px] select-none"
      >
        Register
      </p>
      <Button onClick={handleLoginValidation} disabled={loginLoading}>
        {loginLoading && <Loader2Icon className="animate-spin" />}
        Log in
      </Button>
    </div>
  );
}
