import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const { state } = useLocation();
  const { statusCode } = state || {};
  let title, msg;
  if (statusCode) {
    if (statusCode === 500) {
      title = "Internal Server Error";
      msg =
        "An unexpected error occurred while trying to process your request. Please try again later. If the problem persists, contact our support team.";
    } else if (statusCode === 502) {
      title = "Bad Gateway";
      msg =
        "The server received an invalid response from the upstream server while processing your request. Please try again later.";
    } else if (statusCode === 403) {
      title = "Forbidden";
      msg =
        "You don't have permission to access this resource. Please contact the administrator for more information.";
    } else if (statusCode === 404) {
      title = "Page Not Found";
      msg =
        "Sorry, we couldn't find this page. But don't worry, you can find plenty of other things on our homepage.";
    } else {
      title = "Something went wrong";
      msg =
        "An unexpected error occurred while trying to process your request. Please try again later. If the problem persists, contact our support team.";
    }
  }
  return (
    <section className="flex p-16 items-center justify-center h-screen w-full bg-[#d4b8b8]">
      <div className="max-w-[40rem] text-wrap text-center">
        <h2 className="mb-6 text-[10rem] leading-none text-[#414954] font-extrabold">
          {statusCode || "404"}
        </h2>
        <p className="text-3xl leading-8 text-gray-700 font-bold">
          {title || "Sorry, we couldn't find this page."}
        </p>
        <p className="mt-4 mb-8 text-gray-400 text-lg font-medium">
          {msg ||
            "But don't worry, you can find plenty of other things on our homepage."}
        </p>
        <Link to="/" className="py-3 px-8 rounded font-semibold bg-[#54bab9] no-underline text-[#E8F6EA] text-base">
          Back to homepage
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
