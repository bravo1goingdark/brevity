import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  memo,
  useState,
} from "react";
import { motion } from "framer-motion";
import { buttonVariants, containerVariants } from "../animation/variants";
import { useRecoilState } from "recoil";
import axios, { AxiosResponse } from "axios";
import { LoginUser } from "../@types/register";
import { Link } from "react-router-dom";
import { loginAtom } from "../store/atoms/user/register";
import { useResizeHeight } from "../hooks/useResizeHeight";
import Navbar from "./NavBar";

const Login: FunctionComponent = memo(() => {
  const [credentials, setCredentials] = useRecoilState<LoginUser>(loginAtom);
  const { identifier, password } = credentials;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const h = useResizeHeight();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMessages([]);
    setIsError(false);

    try {
      const key: string = identifier.includes("@") ? "email" : "username";
      const result: AxiosResponse = await axios.post(
        "http://localhost:3000/login",
        {
          [key]: identifier,
          password,
        },
        { withCredentials: true }
      );

      setFeedbackMessages([result.data.msg]);
      setIsError(false);
      setTimeout(() => setFeedbackMessages([]), 10000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setFeedbackMessages([error.response.data.msg || "Login failed."]);
        } else {
          setFeedbackMessages(["Network error. Please try again."]);
        }
        setIsError(true);
      } else {
        setFeedbackMessages(["An unexpected error occurred."]);
        setIsError(true);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div
        style={{ minHeight: h }}
        className="relative flex min-h-screen bg-gray-100 overflow-hidden"
      >
        <div className="flex flex-col justify-center items-start w-1/2 px-8 z-10">
          <h1 className="text-5xl font-bold">
            Welcome back! <br /> Ready to dive into{" "}
            <span className="text-pink-600 font-bold">
              the world of slang?{"\u{1F609}"}
            </span>
          </h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-semibold leading-relaxed mb-6 text-justify"
          >
            Unlock the world of evolving language{" "}
            <span className="text-pink-600 font-bold">right here!</span> <br />
            New here?{" "}
            <Link
              className="font-bold underline text-pink-500"
              to={{ pathname: "/register" }}
            >
              Join Us Today!
            </Link>
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center items-center w-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          variants={containerVariants}
        >
          <form
            className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="identifier"
              >
                Username or Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                type="text"
                name="identifier"
                id="identifier"
                value={identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <span role="img" aria-label="Hide Password">
                      🙈
                    </span>
                  ) : (
                    <span role="img" aria-label="Show Password">
                      👀
                    </span>
                  )}
                </button>
              </div>
            </div>
            {feedbackMessages.length > 0 && (
              <div
                className={`mb-2 text-sm ${
                  isError
                    ? "text-red-500 font-semibold uppercase"
                    : "text-green-500 font-semibold uppercase"
                }`}
              >
                {feedbackMessages.map((message, index) => (
                  <div key={index}>{message}</div>
                ))}
              </div>
            )}

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={buttonVariants}
            >
              <button
                className="relative flex items-center justify-center bg-pink-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 h-12 w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="absolute animate-spin h-5 w-5">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0114.32-4.32 1 1 0 00-1.16 1.6A6 6 0 106 12h-2z"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  `Login ${"\u{1f604}"}`
                )}
              </button>
            </motion.div>
            <br />
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={buttonVariants}
            >
              <button
                className=" justify-center bg-pink-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 h-12 w-full"
                type="button"
              >
                {isLoading ? (
                  <span className="absolute animate-spin h-5 w-5">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0114.32-4.32 1 1 0 00-1.16 1.6A6 6 0 106 12h-2z"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  `Face Based Authentication 📷 `
                )}
              </button>
            </motion.div>

            <div className="text-center mt-4">
              <Link
                className="text-sm text-black font-bold underline"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
});

export default Login;
