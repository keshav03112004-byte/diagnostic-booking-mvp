import { useState } from 'react';

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  return (
    <div className="faq-accordion">
      {faqs.map((faq, index) => (
        <div key={faq.question} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
          <button
            type="button"
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span>{faq.question}</span>
            <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="faq-answer">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
