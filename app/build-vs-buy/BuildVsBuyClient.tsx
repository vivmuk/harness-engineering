"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is a ChatGPT or Claude harness?",
    answer: "A platform harness is a pre-built workflow inside ChatGPT, Claude Projects, Cursor, or similar tools. It usually consists of a system prompt, a few files, and maybe some custom instructions. It is fast to set up and works well for personal, contained tasks.",
  },
  {
    question: "Why would I build a custom harness instead?",
    answer: "A custom harness lives in your repo, uses your tools, enforces your rules, and saves your state. It can call any API, run any script, and evolve with your project. It is the right choice when the workflow is recurring, cross-cutting, or needs persistent memory.",
  },
  {
    question: "What does 'models as harnesses' mean?",
    answer: "It means using a frontier model as the entire reasoning layer: give it a long system prompt, feed it context, and let it figure out the steps. It works for one-off complex tasks, but it is expensive, slow, and stateless. Every run re-derives everything.",
  },
  {
    question: "Why are model-as-harness workflows expensive?",
    answer: "Because they send huge contexts to the model repeatedly. A 100k-token prompt at every step adds up fast, and there is no shared memory or cached plan. A custom harness uses smaller, cheaper calls and reuses encoded rules.",
  },
  {
    question: "When is a platform harness enough?",
    answer: "Use a platform harness for prototypes, personal assistants, ad-hoc analysis, or anything you will only run a few times. If the output quality matters, the workflow repeats, or multiple people need to run it, move to a custom harness.",
  },
  {
    question: "Can I combine both?",
    answer: "Yes. Many teams prototype inside ChatGPT or Claude to learn what the workflow should be, then codify the winning patterns into a custom harness. The platform harness is the sketch; the custom harness is the production system.",
  },
  {
    question: "Do I need to be a programmer to build a harness?",
    answer: "Not necessarily. You can start with markdown rules, simple command playbooks, and no code. As the workflow matures, you add typed code for the parts that matter. The Harness Engineering generator gives you a complete starter kit either way.",
  },
  {
    question: "How long does it take to build a harness?",
    answer: "A minimal useful harness can be built in an afternoon: one rule file, one command, one state schema, and one QA check. The real investment is logging anti-patterns as you use it, which makes the harness smarter over time.",
  },
  {
    question: "What if my domain is not AI production?",
    answer: "Harnesses are domain-agnostic. The same pattern works for recipe books, fitness plans, research reports, trading strategies, language learning, and more. The generator adapts the layers to whatever domain you describe.",
  },
  {
    question: "How is this different from no-code automation?",
    answer: "No-code tools connect pre-built blocks. A harness is a living system of rules, state, and specialist agents that can reason, confirm, evaluate, and improve. It is more flexible and more durable for complex workflows.",
  },
];

export function BuildVsBuyClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section className="pb-32">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/5 bg-surface overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-2 transition-colors"
              >
                <span className="font-semibold text-text pr-4">{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-accent shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-text-secondary shrink-0" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
