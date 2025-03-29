import type { Metadata } from "next";

export const DEFAULT_METADATA: Metadata = {
    metadataBase: new URL('https://git-first-commit.pages.dev'),
    title: "Git First Commit",
    description: "Find the first commit of any GitHub repository",
    authors: {
        name: "Doarakko",
        url: "https://x.com/dodododoarakko",
    },
    openGraph: {
        title: "Git First Commit",
        description: "Find the first commit of any GitHub repository",
        siteName: "Git First Commit",
        type: "website",
        images: [
            {
                url: "og.png",
                width: 1200,
                height: 630,
                alt: "Git First Commit",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
    },
    robots: "index, follow",
};

export const GITHUB_REPOSITORY_NAME_REGEX = /^(?!.*[.-]{2})(?!.*[.-]$)(?!.*[.-]{2})[a-zA-Z0-9._-]{1,100}$/;
