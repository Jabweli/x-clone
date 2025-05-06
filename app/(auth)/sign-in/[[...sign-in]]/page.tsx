"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-[90%] my-10 mx-auto flex flex-col md:flex-row h-screen items-center">
      <div className="flex items-center justify-start w-full lg:w-1/2 lg:h-full lg:justify-center mb-8 lg:mb-0">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={24}
          height={24}
          className="w-[50px] md:w-[250px] lg:w-[320px]"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-3xl xsm:text-4xl md:text-7xl font-bold">
          Happening now
        </h1>
        <h1 className="text-[23px] md:text-[30px] font-bold">Join today.</h1>
        <SignIn.Root>
          <Clerk.Connection
            name="google"
            className="bg-white text-bgBlack text-sm rounded-full p-3 flex items-center justify-center gap-2 font-semibold w-full md:w-92 cursor-pointer"
          >
            <Image src="/icons/google.png" alt="" width={18} height={18} />
            Sign in with Google
          </Clerk.Connection>
          <Clerk.Connection
            name="apple"
            className="bg-white text-bgBlack text-sm rounded-full p-3 flex items-center justify-center gap-2 font-semibold w-full md:w-92 cursor-pointer"
          >
            <Image src="/icons/apple-logo.png" alt="" width={18} height={18} />
            Sign in with Apple
          </Clerk.Connection>

          <div className="relative w-full md:w-92 text-center text-textGray font-semibold">
            <span className="absolute top-1/2 left-0 w-full h-[1px] bg-borderGray transform -translate-y-1/2" />
            <span className="relative z-10 bg-bgBlack px-3 text-sm">OR</span>
          </div>

          {/* LOGIN WITH CREDENTIALS */}
          <SignIn.Step name="start" className="w-full md:w-92">
            <Clerk.Field name="identifier" className="flex flex-col gap-2">
              <Clerk.Input
                placeholder="Phone, email or username"
                className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
              />
              <Clerk.FieldError className="text-red-300 text-xs" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="mt-4 flex items-center justify-center rounded-full bg-iconBlue text-white w-full py-3 cursor-pointer font-semibold text-sm"
            >
              <Clerk.Loading>
                {(isLoading) => (isLoading ? "Loading..." : "Continue")}
              </Clerk.Loading>
            </SignIn.Action>

            <p className="text-[11px] text-textGray mt-2">
              By signing up, you agree to the{" "}
              <span className="text-iconBlue">Terms of Service</span> and
              <span className="text-iconBlue"> Privacy Policy</span>, including
              <span className="text-iconBlue"> Cookie Use.</span>
            </p>
          </SignIn.Step>

          <SignIn.Step name="verifications">
            <SignIn.Strategy name="password">
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="Password"
                  className="py-4 px-6 rounded-lg bg-transparent text-white w-full md:w-92 outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="mt-4 flex items-center justify-center rounded-full bg-iconBlue text-white w-full md:w-92 py-3 cursor-pointer font-semibold text-sm"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Login")}
                </Clerk.Loading>
              </SignIn.Action>

              <SignIn.Action
                navigate="forgot-password"
                className="mt-2 text-sm text-iconBlue cursor-pointer"
              >
                Forgot password?
              </SignIn.Action>
            </SignIn.Strategy>

            <SignIn.Strategy name="reset_password_email_code">
              <h1>Verify your email address</h1>
              <p className="text-iconBlue text-sm mb-4">
                <span className="text-textGray">We sent a code to</span>{" "}
                <SignIn.SafeIdentifier />.
              </p>

              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="Enter verification code"
                  className="py-3 px-6 rounded-lg bg-transparent text-white w-full md:w-92outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="mt-4 flex items-center justify-center rounded-full bg-iconBlue text-white w-full md:w-92 py-3 cursor-pointer font-semibold text-sm"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Continue")}
                </Clerk.Loading>
              </SignIn.Action>

              {/* resend code */}
              <SignIn.Action
                resend
                fallback={({ resendableAfter }) => (
                  <p>Resend code in {resendableAfter} second(s)</p>
                )}
              >
                Resend code
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>

          {/* forgot password step */}
          <SignIn.Step name="forgot-password" className="w-full md:w-92">
            <h1 className="text-sm text-textGray">Forgot your password?</h1>

            <div className="flex items-center justify-between mt-2">
              <SignIn.SupportedStrategy name="reset_password_email_code">
                <span className="flex items-center justify-center rounded-full bg-iconBlue text-white px-8 py-3 cursor-pointer font-semibold text-sm w-full">
                  <Clerk.Loading>
                    {(isLoading) =>
                      isLoading ? "Loading..." : "Reset password"
                    }
                  </Clerk.Loading>
                </span>
              </SignIn.SupportedStrategy>

              <SignIn.Action
                navigate="previous"
                className="border-[1px] border-borderGray py-3 px-4 bg-transparent rounded-full text-sm cursor-pointer"
              >
                Go back
              </SignIn.Action>
            </div>
          </SignIn.Step>

          {/* reset password step */}
          <SignIn.Step
            name="reset-password"
            className="flex flex-col gap-4 w-full md:w-92"
          >
            <h1>Reset your password</h1>

            <Clerk.Field name="password" className="flex flex-col gap-2">
              <Clerk.Input
                placeholder="New password"
                className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <Clerk.Field name="confirmPassword" className="flex flex-col gap-2">
              <Clerk.Input
                placeholder="Confirm password"
                className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="flex items-center justify-center rounded-full bg-iconBlue text-white w-full md:w-92 py-3 cursor-pointer font-semibold text-sm"
            >
              <Clerk.Loading>
                {(isLoading) => (isLoading ? "Loading..." : "Reset password")}
              </Clerk.Loading>
            </SignIn.Action>
          </SignIn.Step>

          <div className="mt-3 text-sm text-textGray flex items-center justify-center gap-1 w-full md:w-92">
            <span>Don't have an account?</span>
            <Link
              href="/sign-up"
              className="text-iconBlue cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </SignIn.Root>
      </div>
    </div>
  );
}
