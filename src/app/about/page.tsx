
import Link from 'next/link';

export default function AboutPage() {
  const faqs = [
    {
      question: 'Why is it only for NYC? Is this some elitist, ivory tower, coastal bullshit?',
      answer: 'Yes.',
    },
    {
      question: 'Why do you only rate Diet Coke and not Caesar salads and fries?',
      answer: 'Foods are fads; Diet Coke is a lifestyle.',
    },
    {
      question: 'Are you in any way associated with the real Diet Coke company?',
      answer: 'Only through a crippling addiction.',
    },
    {
      question: 'Can I add a review for Coke Zero?',
      answer: 'No, the fuck you may not.',
    },
    {
      question: 'Is Pepsi ok?',
      answer: 'Close this website and delete your cookies.',
    },
    {
      question: 'Is entering a Diet Coke review praxis?',
      answer: 'No, but also, in a way, yes.',
    },
    {
      question: "Why can't I post a picture with my review?",
      answer: `I don't need you sickos "showing hole" on my nice Diet Coke review site. Also I'm not paying for image hosting right now.`,
    },
    {
      question: 'What will you do if I make a Diet Coke review website for my own town?',
      answer: 'Dark web hitman.',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-gray-700 hover:text-gray-900">
            &larr; Back to Map
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block font-serif">DCNYC</span>
            <span className="block text-indigo-600 text-4xl">Frequently Asked Questions</span>
          </h1>
        </div>

        <div className="space-y-10">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <dt className="text-xl font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-base text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 