import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/constants";

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  robots: "noindex, nofollow",
};

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
      <h1 className="text-center text-2xl">Privacy Policy</h1>
      <div className="pt-4 pl-8 pr-8 leading-8">
        This site uses Google Analytics, a traffic analysis tool by Google. This
        tool uses cookies to collect information on how site visitors use our
        site. This information includes IP address, browser type, referrer
        information, language used, and time of visit. This information is
        stored on servers provided by Google. Google will not disclose this
        information to third parties. However, Google may be required to
        disclose this information if required to do so by law; by using Google
        Analytics, you consent to the collection and use of this information by
        Google for the purposes described above. If you do not wish to allow the
        collection of information by cookies, you may refuse the use of cookies
        by changing the settings on your browser. However, if you do so, you may
        not be able to use all of the features of this site. The privacy policy
        of this site is subject to change. You can check this page periodically
        to ensure that you are aware of the latest version of our privacy
        policy.
      </div>
    </div>
  );
};

export default Privacy;
