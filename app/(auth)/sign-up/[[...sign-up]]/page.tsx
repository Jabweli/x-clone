"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
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
        <SignUp.Root>
          <SignUp.Step
            name="start"
            className="flex flex-col gap-4 w-full md:w-92"
          >
            <Clerk.Connection
              name="google"
              className="bg-white text-bgBlack text-sm rounded-full p-3 flex items-center justify-center gap-2 font-semibold w-full md:w-92 cursor-pointer"
            >
              <Image src="/icons/google.png" alt="" width={18} height={18} />
              <Clerk.Loading scope="provider:google">
                {(isLoading) =>
                  isLoading ? "Loading..." : "Sign Up with Google"
                }
              </Clerk.Loading>
            </Clerk.Connection>
            <Clerk.Connection
              name="apple"
              className="bg-white text-bgBlack text-sm rounded-full p-3 flex items-center justify-center gap-2 font-semibold w-full md:w-92 cursor-pointer"
            >
              <Image
                src="/icons/apple-logo.png"
                alt=""
                width={18}
                height={18}
              />
              <Clerk.Loading scope="provider:apple">
                {(isLoading) =>
                  isLoading ? "Loading..." : "Sign Up with Apple"
                }
              </Clerk.Loading>
            </Clerk.Connection>

            <div className="relative w-full md:w-92 text-center text-textGray font-semibold">
              <span className="absolute top-1/2 left-0 w-full h-[1px] bg-borderGray transform -translate-y-1/2" />
              <span className="relative z-10 bg-bgBlack px-3 text-sm">OR</span>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-92">
              <h1 className="text-lg font-bold">Create your account</h1>

              <Clerk.Field name="username" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="Username"
                  className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="Email address"
                  className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="Password"
                  className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <div id="clerk-captcha" />
              {/* <SignUp.Captcha /> */}

              <SignUp.Action
                submit
                className="w-full flex items-center justify-center rounded-full bg-white text-black py-4 cursor-pointer font-semibold text-sm"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Continue")}
                </Clerk.Loading>
              </SignUp.Action>
            </div>

            <div className="w-full md:w-92">
              <p className="text-[11px] text-textGray mt-2">
                By signing up, you agree to the{" "}
                <span className="text-iconBlue">Terms of Service</span> and
                <span className="text-iconBlue"> Privacy Policy</span>,
                including
                <span className="text-iconBlue"> Cookie Use.</span>
              </p>
            </div>
          </SignUp.Step>

          <SignUp.Step
            name="continue"
            className="w-full md:w-92 flex flex-col gap-4"
          >
            <h1>Fill in missing fields</h1>

            <Clerk.Field name="username">
              <Clerk.Input
                placeholder="Username"
                className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
              />
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>

            <SignUp.Action
              submit
              className="w-full flex items-center justify-center rounded-full bg-iconBlue text-white py-4 cursor-pointer font-semibold text-sm"
            >
              <Clerk.Loading>
                {(isLoading) => (isLoading ? "Loading..." : "Sign Up")}
              </Clerk.Loading>
            </SignUp.Action>
          </SignUp.Step>

          <SignUp.Step name="verifications" className="w-full md:w-92">
            <SignUp.Strategy name="email_code">
              <h1 className="text-2xl font-bold">Verify your email</h1>
              <span className="text-sm text-textGray">
                A verification code has been sent to your email
              </span>

              <Clerk.Field name="code" className="flex flex-col gap-2 my-6">
                <Clerk.Input
                  placeholder="Enter verification code"
                  className="py-3 px-6 rounded-lg bg-transparent text-white w-full outline-0 border-1 border-borderGray placeholder:text-textGray"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>

              <SignUp.Action
                submit
                className="w-full flex items-center justify-center rounded-full bg-iconBlue text-white py-4 cursor-pointer font-semibold text-sm"
              >
                <Clerk.Loading>
                  {(isLoading) => (isLoading ? "Loading..." : "Verify")}
                </Clerk.Loading>
              </SignUp.Action>

              <SignUp.Action
                resend
                fallback={({ resendableAfter }) => (
                  <p className="text-sm text-textGray mt-2">
                    Resend code in {resendableAfter} second(s)
                  </p>
                )}
                className="text-sm text-iconBlue mt-2 cursor-pointer underline"
              >
                Resend code
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>

          <div className="mt-3 text-sm text-textGray flex items-center justify-center gap-1 w-full md:w-92">
            <span>Already have an account?</span>
            <Link
              href="/sign-in"
              className="text-iconBlue cursor-pointer hover:underline"
            >
              Sign In
            </Link>
          </div>
        </SignUp.Root>
      </div>
    </div>
  );
}
