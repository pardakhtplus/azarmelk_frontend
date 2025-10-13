import { safeDecodeURIComponent } from "@/lib/utils";
import { API_CONFIG } from "@/services/api-config";
import { handleQueries } from "@/services/axios-client";
import { serverApi } from "@/services/server-api";
import { type TGetLanding } from "@/types/client/landing/types";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import EstateList from "./_components/EstateList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  // Decode the slug to handle Persian characters properly
  const slug = safeDecodeURIComponent(rawSlug);

  let landing: TGetLanding | null = null;

  try {
    landing = await serverApi.get<TGetLanding>(
      API_CONFIG.endpoints.client.landing.get +
        "?" +
        handleQueries({ slug, page: 1, limit: 9 }),
    );
  } catch (error) {
    console.error(error);
    return {
      title: "Landing",
      description: "Landing",
    };
  }

  if (!landing)
    return {
      title: "Landing",
      description: "Landing",
    };

  return {
    title: landing?.data[0].title,
    description: landing?.data[0].description,
  };
}
export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  // Decode the slug to handle Persian characters properly
  const slug = safeDecodeURIComponent(rawSlug);

  let landing: TGetLanding | null = null;

  try {
    landing = await serverApi.get<TGetLanding>(
      API_CONFIG.endpoints.client.landing.get +
        "?" +
        handleQueries({ slug, page: 1, limit: 9 }),
    );
  } catch (error) {
    console.error(error);
    notFound();
  }

  if (!landing) notFound();

  return (
    <>
      <section className="container pt-12">
        <h1 className="mb-3 text-[28px] font-bold">{landing?.data[0].title}</h1>
        <p className="text-sm/6 text-text-300">
          {landing?.data[0].description}
        </p>
        <EstateList slug={slug} initialData={landing} />
      </section>
    </>
  );
}
