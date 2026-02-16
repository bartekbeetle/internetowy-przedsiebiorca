"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@repo/ui";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  darkMode?: boolean;
}

export function FAQ({ items, darkMode = false }: FAQProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger
            className={
              darkMode
                ? "text-white hover:text-orange-500"
                : "text-slate-900 hover:text-orange-600"
            }
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent
            className={darkMode ? "text-slate-400" : "text-slate-600"}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
