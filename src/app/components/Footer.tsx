import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="absolute bottom-0 w-full py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/sponsors/Doarakko"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <span>Sponsor</span>
          </a>
          <a
            href="/privacy"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            Privacy Policy
          </a>
        </div>
        <a
          href="https://github.com/Doarakko"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          @Doarakko
        </a>
      </div>
    </footer>
  );
};

export default Footer;
