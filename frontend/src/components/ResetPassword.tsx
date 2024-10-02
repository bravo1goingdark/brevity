import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  memo,
  useEffect,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useResizeHeight } from "../hooks/useResizeHeight";
import Navbar from "./NavBar";

const ResetPassword: FunctionComponent = memo(() => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const h = useResizeHeight();

  useEffect(() => {
    if (!token) {
      setIsError(true);
      setFeedbackMessage("Invalid or missing token.");
    }
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setFeedbackMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setFeedbackMessage("");
    setIsError(false);

    try {
      const response = await axios.put(
        "http://localhost:3000/reset-password",
        {
          newPassword,
        },
        {
          params: {
            token,
          },
        }
      );
      setFeedbackMessage(response.data.msg);
      setIsError(false);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFeedbackMessage(
          error.response?.data.msg || "An error occurred. Please try again."
        );
      } else {
        setFeedbackMessage("An unexpected error occurred. Please try again.");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{ minHeight: h }}
        className="relative flex min-h-screen bg-gray-100 overflow-hidden"
      >
        <motion.div
          className="flex justify-center items-center w-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <form
            className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {feedbackMessage && (
              <div
                className={`mb-2 text-sm ${
                  isError
                    ? "text-red-500 font-semibold uppercase"
                    : "text-green-500 font-semibold uppercase"
                }`}
              >
                {feedbackMessage}
              </div>
            )}

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  `Reset Password`
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>

        <div className="flex justify-center items-center w-1/2 px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-semibold leading-relaxed text-justify"
          >
            <p className="text-5xl font-bold">Reset Your Password</p>
            <p className="leading-relaxed text-justify text-3xl text-pink-600 font-bold">
              Create a new password to secure your account.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
});

export default ResetPassword;