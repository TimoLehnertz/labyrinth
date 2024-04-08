import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    console.log("headers");
    // console.log(localStorage.getItem("jwt"));
    return [
      //   {
      //     key: "auth",
      //     value: localStorage.getItem("jwt"),
      //   },
    ];
  },
};

export default withNextIntl(nextConfig);
