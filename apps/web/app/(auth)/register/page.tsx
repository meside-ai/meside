"use client";

import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { getGoogleLogin, getRegister } from "../../../queries/auth";
import { setAuthTokens } from "../../../utils/auth-storage";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    ...getRegister(),
    onSuccess: () => {
      // After successful registration, redirect to login page
      router.push("/login");
    },
    onError: () => {
      setError("Registration failed. Please try again.");
    },
  });

  const googleLoginMutation = useMutation({
    ...getGoogleLogin(),
    onSuccess: (data) => {
      setAuthTokens(data.token, data.refreshToken);
      router.push("/");
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  const handleSubmit = (values: z.infer<typeof registerSchema>) => {
    setError(null);
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  const handleGoogleLogin = () => {
    // In a real implementation, you would use Google's OAuth flow
    const mockIdToken = "google-mock-id-token";
    googleLoginMutation.mutate({ idToken: mockIdToken });
  };

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" fw={500} ta="center" mb="md">
          Create an account
        </Text>

        <Button
          fullWidth
          variant="default"
          leftSection={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 48 48"
              aria-labelledby="googleLogo"
            >
              <title id="googleLogo">Google Logo</title>
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
          }
          onClick={handleGoogleLogin}
          loading={googleLoginMutation.isPending}
        >
          Continue with Google
        </Button>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {error && (
              <Text c="red" size="sm" ta="center">
                {error}
              </Text>
            )}

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
              error={form.errors.email}
            />

            <TextInput
              required
              label="Username"
              placeholder="Your username"
              {...form.getInputProps("username")}
              error={form.errors.username}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps("password")}
              error={form.errors.password}
            />

            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              {...form.getInputProps("confirmPassword")}
              error={form.errors.confirmPassword}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text component={Link} href="/login" size="sm">
              Already have an account? Login
            </Text>
            <Button type="submit" loading={registerMutation.isPending}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
