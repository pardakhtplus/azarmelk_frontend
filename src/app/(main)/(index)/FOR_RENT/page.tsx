import { DealTypeEnum } from "@/lib/categories";
import Hero from "../_components/Hero";
import LatestEstates from "../_components/LatestEstates";
import QuestionBox from "../_components/questionBox/QuestionBox";
import { type Metadata } from "next";

const defaultDealType = DealTypeEnum.FOR_RENT;

export const metadata: Metadata = {
  title: "رهن و اجاره",
  description: "رهن و اجاره",
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
