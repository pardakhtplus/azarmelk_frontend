"use client";

import { useState } from "react";
import QuestionBoxItem from "./QuestionBoxItem";
import { questions } from "../../../../../../data/questions";

export interface QuestionBoxProps {
  title?: string;
  allowMultipleOpen?: boolean;
}

export default function QuestionBox({
  title,
  allowMultipleOpen = false,
}: QuestionBoxProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    if (!allowMultipleOpen) {
      setOpenItemId(openItemId === id ? null : id);
    }
  };

  return (
    <section className="container mb-24 py-8">
      {title && (
        <h2 className="mb-[50px] text-center text-xl font-bold sm:text-2xl">
          {title}
        </h2>
      )}
      <div className="space-y-5">
        {questions.map((item) => (
          <QuestionBoxItem
            key={item.id}
            id={item.id.toString()}
            question={item.question}
            answer={item.answer}
            isOpen={
              !allowMultipleOpen ? openItemId === item.id.toString() : undefined
            }
            onToggle={!allowMultipleOpen ? handleToggle : undefined}
          />
        ))}
      </div>
    </section>
  );
}
