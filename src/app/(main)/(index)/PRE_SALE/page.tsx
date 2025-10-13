import { DealTypeEnum } from "@/lib/categories";
import { type Metadata } from "next";
import Hero from "../_components/Hero";
import LatestEstates from "../_components/LatestEstates";
import QuestionBox from "../_components/questionBox/QuestionBox";

const defaultDealType = DealTypeEnum.PRE_SALE;

export const metadata: Metadata = {
  title: "پیش فروش",
  description: "پیش فروش",
};

export default function Home() {
  return (
    <>
      <Hero dealType={defaultDealType} />
      <LatestEstates dealType={defaultDealType} />
      <QuestionBox allowMultipleOpen={false} />
    </>
  );
}
