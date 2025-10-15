import Header, { type HeaderContent } from "@/components/Header";
import HeroSection, {
  type HeroContent,
} from "@/components/HeroSection";
import { draftMode } from "next/headers";
import qs from "qs";

type MediaFileAttributes = {
  url?: string | null;
  alternativeText?: string | null;
};

type MediaEntity = {
  data?: {
    attributes?: MediaFileAttributes | null;
  } | null;
};

type HeaderEntry = {
  id?: number;
  documentId?: string;
  Logo?: MediaEntity;
  Phone?: number | string | null;
  PrimaryCTA?: string | null;
};

type HeaderApiResponse = {
  data?: HeaderEntry[];
};

type HeroEntry = {
  id?: number;
  documentId?: string;
  Title?: string | null;
};

type HeroApiResponse = {
  data?: HeroEntry[];
};

function resolveMediaUrl(media?: MediaEntity) {
  const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(/\/$/, "");
  const url = media?.data?.attributes?.url;
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${base}${url}`;
}

function normalizeHeader(entry?: HeaderEntry | null): HeaderContent | null {
  if (!entry) return null;

  const logoAlt = entry.Logo?.data?.attributes?.alternativeText;

  return {
    logoUrl: resolveMediaUrl(entry.Logo),
    logoAlt: logoAlt ?? undefined,
    phone: entry.Phone ?? undefined,
    primaryCtaLabel: entry.PrimaryCTA ?? undefined
  };
}

function normalizeHero(entry?: HeroEntry): HeroContent {
  return {
    title: entry?.Title ?? '',
  };
}

async function fetchHeaderContent({ draft }: { draft: boolean }) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL!;
  const qsParams = qs.stringify(
    {
      populate: "*",
      status: draft ? "draft" : "published"
    },
    { encodeValuesOnly: true }
  );

  const headers: Record<string, string> = {};
  if (draft && process.env.STRAPI_PREVIEW_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.STRAPI_PREVIEW_TOKEN}`;
  }

  const res = await fetch(`${base}/api/headers?${qsParams}`, {
    cache: "no-store",
    headers
  });

  if (!res.ok) throw new Error("Failed to fetch header content");
  const json = (await res.json()) as HeaderApiResponse;
  return normalizeHeader(json.data?.[0]);
}

async function fetchHeroContent({ draft }: { draft: boolean }) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL!;
  const qsParams = qs.stringify(
    {
      populate: "*",
      status: draft ? "draft" : "published"
    },
    { encodeValuesOnly: true }
  );

  const headers: Record<string, string> = {};
  if (draft && process.env.STRAPI_PREVIEW_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.STRAPI_PREVIEW_TOKEN}`;
  }

  const res = await fetch(`${base}/api/contents?${qsParams}`, {
    cache: "no-store",
    headers
  });
  if (!res.ok) throw new Error("Failed to fetch hero content");
  const json = (await res.json()) as HeroApiResponse;
  return normalizeHero(json.data?.[0]);
}

export default async function Home() {
  const { isEnabled } = await draftMode();

  const [headerContent, heroContent] = await Promise.all([
    fetchHeaderContent({ draft: isEnabled }),
    fetchHeroContent({ draft: isEnabled })
  ]);
  console.log('headerContentheaderContent', headerContent);

  return (
    <div className="flex min-h-screen flex-col bg-[#04030f]">
      <Header content={headerContent} />
      <HeroSection content={heroContent} />
    </div>
  );
}
