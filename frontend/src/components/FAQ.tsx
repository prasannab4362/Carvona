"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-light py-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-semibold text-text-main hover:text-primary transition-colors focus:outline-none"
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-muted mt-2 leading-relaxed pb-2">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "How does the license plate detection work?",
      answer:
        "Our system uses advanced AI computer vision to locate the exact bounding coordinates of license plates. The algorithm computes the skew angle, aspect ratio, and perspective transformation to ensure overlays map perfectly onto the original plate.",
    },
    {
      question: "Is my privacy protected?",
      answer:
        "Yes, absolutely. All processing for the trial is done directly inside your web browser. We do not store, view, or train models on your uploaded vehicle photos. Once you close the tab, the image cache is cleared.",
    },
    {
      question: "What is the difference between Plate Blur and Logo Replacement?",
      answer:
        "License Plate Blur is 100% free and unlimited, blurring plates to protect privacy. Logo Replacement allows dealerships to replace plates with their custom branding logo. Logo Replacement costs ₹2 per image, with the first download free.",
    },
    {
      question: "Can I upload my own dealership logo?",
      answer:
        "Yes! You can upload custom PNG, JPEG, or SVG logo images. The workbench provides fine-tuning controls to adjust the scale, perspective, and alignment of the logo on the plate for a professional finish.",
    },
    {
      question: "How does the pricing and trial work?",
      answer:
        "The first logo replacement image is free to download as a trial. Subsequent logo replacements cost ₹2 per image. There are no subscriptions, registration walls, or hidden fees. You only pay for what you download.",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-border-light p-8 md:p-10 shadow-sm">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-text-main">Frequently Asked Questions</h3>
        <p className="text-sm text-text-muted mt-2">
          Everything you need to know about Carvona&apos;s image processing
        </p>
      </div>
      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
