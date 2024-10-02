import { ChangeEvent, FormEvent, FunctionComponent, memo, useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants, containerVariants } from "../animation/variants";
import { useRecoilState } from "recoil";
import { RegisterUser } from "../@types/register";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { registerAtom } from "../store/atoms/user/register";
import {useResizeHeight} from "../hooks/useResizeHeight";
import Navbar from "./NavBar";



const Register: FunctionComponent = memo(() => {
  const [fields, setFields] = useRecoilState<RegisterUser>(registerAtom);
  const { username, email, password } = fields;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contentHeight = useResizeHeight();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMessages([]);
    setIsError(false);

    if (isNaN(Number(username))) {
      try {
        const result: AxiosResponse = await axios.post(
          "http://localhost:3000/register",
          {
            username,
            email,
            password,
          }
        );

        setFeedbackMessages([result.data.msg, result.data.mail]);
        setIsError(false);
        setTimeout(() => {
          setFeedbackMessages([]);
          navigate("/login");
        },3000)
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setFeedbackMessages([
              error.response.data.msg || "Registration failed.",
            ]);
          } else {
            setFeedbackMessages(["Network error. Please try again."]);
          }
          setIsError(true);
        } else {
          setFeedbackMessages(["An unexpected error occurred."]);
          setIsError(true);
        }
      }
    } else {
      setFeedbackMessages(["Username cannot be a number."]);
      setIsError(true);
    }

    setIsLoading(false);
  };

  

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100" style={{ height: contentHeight }}>
        <div className="flex flex-col justify-center items-start w-1/2 px-8 z-10">
          <h1 className="text-5xl font-bold">
            Join us in redefining communication through{" "}
            <span className="text-pink-600 font-bold">
              the power of slang!{"\u{1F973}"}
            </span>
          </h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-semibold leading-relaxed mb-6 text-justify"
          >
            Whether you're a{" "}
            <span className="text-pink-600 font-bold">wordsmith</span>, a{" "}
            <span className="text-pink-600 font-bold">lover of languages</span>,
            or simply someone who enjoys the evolving nature of slang, our
            platform offers a unique space to express yourself like never
            before. <br />
            Already a User?{" "}
            <Link
              className="text-pink-600 underline font-bold"
              to={{ pathname: "/login" }}
            >
              Login{" "}
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
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                type="email"
                name="email"
                id="email"
                value={email}
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
                  `Register ${"\u{1f607}"}`
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </>
  );
});

export default Register;