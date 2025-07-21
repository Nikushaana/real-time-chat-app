"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();

  const [signupValues, setSignupValues] = useState<{
    email: string;
    password: string;
    repeatPassword?: string;
  }>({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<Record<string, string>>({});

  // validation
  const signUpSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
        "Please enter a valid email address (e.g., user@example.com)."
      ),

    password: Yup.string()
      .required("Password is required.")
      .min(6, "Password must be at least 6 characters long."),

    repeatPassword: Yup.string()
      .required("Please repeat your password.")
      .min(6, "Repeated password must be at least 6 characters.")
      .oneOf([Yup.ref("password")], "Passwords do not match."),
  });

  const handleSignUpValidation = () => {
    signUpSchema
      .validate(signupValues, { abortEarly: false })
      .then(() => {
        setSignUpError({});
        handleSignup();
      })
      .catch((err) => {
        if (err instanceof Yup.ValidationError) {
          const newErrors: Record<string, string> = {};
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          setSignUpError(newErrors);

          Object.values(newErrors).forEach((msg) => {
            toast.error(msg, { autoClose: 3000 });
          });
        } else {
          toast.error("Unexpected validation error", { autoClose: 3000 });
        }
      });
  };

  // signup functionality
  const handleSignup = async () => {
    setSignUpLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupValues.email,
      password: signupValues.password,
    });

    if (error) {
      toast.error("Sign Up failed", { autoClose: 3000 });
      setSignUpLoading(false);
      return;
    }

    toast.success("Signed up successfully! Check your email!", {
      autoClose: 5000,
    });
    setSignUpLoading(false);
    router.push("/auth/login");
  };

  return (
    <div
      className={`w-full flex flex-col gap-y-[10px] ${
        signUpLoading && "pointer-events-none opacity-[0.7]"
      }`}
    >
      <InputWithLabel
        title="Email"
        name="email"
        setValue={setSignupValues}
        error={signUpError.email}
      />
      <InputWithLabel
        title="Password"
        name="password"
        setValue={setSignupValues}
        isPassword={true}
        error={signUpError.password}
      />
      <InputWithLabel
        title="Repeat Password"
        name="repeatPassword"
        setValue={setSignupValues}
        isPassword={true}
        error={signUpError.repeatPassword}
      />
      <p
        onClick={() => {
          router.push("/auth/login");
        }}
        className="underline self-end cursor-pointer text-[15px] select-none"
      >
        Back to login
      </p>
      <Button onClick={handleSignUpValidation} disabled={signUpLoading}>
        {signUpLoading && <Loader2Icon className="animate-spin" />}
        sign up
      </Button>
    </div>
  );
}
