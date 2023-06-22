import { inject } from "@vercel/analytics";

const Analytics = () => {
  inject({ mode: "auto" });
};
export default Analytics;
