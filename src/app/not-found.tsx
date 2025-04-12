import { DEFAULT_METADATA } from "@/constants";
import type { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  title: "404",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-4 sm:px-6 md:px-8 lg:px-10 text-gray-700">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">404</h1>
        <p className="text-lg">
          Good morning, and in case I don't see ya, good afternoon, good
          evening, and good night!
        </p>
      </div>
    </div>
  );
}
