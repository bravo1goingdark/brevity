import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  memo,
  useState,
} from "react";
import { motion } from "framer-motion";
import { buttonVariants, containerVariants } from "../animation/variants";
import axios, { AxiosResponse } from "axios";
import Navbar from "./NavBar";
import { useResizeHeight } from "../hooks/useResizeHeight";
import { RequestedSlang } from "../@types/slang";

const Home: FunctionComponent = memo(() => {
  const [searchTerm, setSearchTerm] = useState<string>("ykwim");
  const [slang, setSlang] = useState<RequestedSlang | null>(null);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contentHeight = useResizeHeight();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMessages([]);
    setIsError(false);

    try {
      const result: AxiosResponse<RequestedSlang> = await axios.get(
        `http://localhost:3000/`,{
          params: {
            requestedTerm: searchTerm,
          },
        }
      );

      if (result.data) {
        setFeedbackMessages(["Search successful!"]);
        setSlang(result.data);
        setIsError(false);
      } else {
        setFeedbackMessages(["No results found."]);
        setIsError(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setFeedbackMessages([error.response.data.msg || "Search failed."]);
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
      <div className="flex bg-gray-100" style={{ height: contentHeight }}>
        <div className="flex flex-col justify-center items-start w-1/2 px-8 z-10">
          <h1 className="text-5xl font-bold">
            Discover the{" "}
            <span className="text-pink-600 font-bold">latest slang!</span>
          </h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-semibold leading-relaxed mb-6 text-justify"
          >
            Search for the term you're curious about and explore its definition,
            context and origin. Dive into the world of evolving language.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col justify-center items-center w-1/2 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          variants={containerVariants}
        >
          {!slang ? (
            <form
              className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full h-12 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 text-base"
                  type="text"
                  name="searchTerm"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={handleChange}
                  required
                />
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
                    `Search ${"\u{1f50d}"}`
                  )}
                </button>
              </motion.div>
            </form>
          ) : (
            <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg w-full max-w-md mt-8 border border-gray-800">
              <p className="text-3xl font-mono tracking-wide text-gray-200 mb-4 capitalize flex justify-between items-center">
                <span>{slang.term}</span>
                <span className="text-sm bg-green-600 font-semibold py-1 px-2 rounded-full capitalize ml-4">
                  ID: {slang.id}
                </span>
              </p>

              <div className="mb-4">
                <p className="text-gray-600 text-sm">Definition</p>
                <p className="text-lg font-semibold text-gray-300 mt-1 capitalize">
                  {slang.definition}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Context</p>
                <p className="text-lg font-semibold text-gray-300 mt-1 capitalize">
                  {slang.context}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm ">Origin</p>
                <p className="text-lg font-semibold text-gray-300 mt-1 capitalize">
                  {slang.origin}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm ">Submitted by:</p>
                <p className="flex items-center text-lg ">
                  {slang.submittedBy}
                  {slang.isEnforcer && (
                    <span
                      className="ml-2 text-yellow-500"
                      role="img"
                      aria-label="Enforcer Badge"
                    >
                      <div className="rounded-md bg-green-600">ENFORCER</div>
                    </span>
                  )}
                </p>
              </div>

              <button
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 ease-in-out w-full mt-4"
                onClick={() => setSlang(null)}
              >
                Search
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
});

export default Home;