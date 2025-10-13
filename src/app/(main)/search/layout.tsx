import { Suspense } from "react";
import QuestionBox from "../(index)/_components/questionBox/QuestionBox";

export default function layout({ children }) {
  return (
    <>
      <Suspense>{children}</Suspense>
      <QuestionBox />
    </>
  );
}
