import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import faqs from "../components/faq/faqs.json"; // Ensure the path is correct

export default function FaqPage() {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-black">FAQ</h1>
        <p className="my-2 text-sm text-gray-700">
          Common Questions and Answers
        </p>

        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            {" "}
            {/* Reduced vertical padding */}
            <div className="mx-auto max-w-4xl">
              <dl className="mt-6 space-y-6 divide-y divide-gray-900/10">
                {" "}
                {/* Reduced top margin */}
                {faqs.map((faq) => (
                  <Disclosure as="div" key={faq.question} className="pt-6">
                    {({ open }) => (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                            <span className="text-base font-semibold leading-7">
                              {faq.question}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <MinusSmallIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusSmallIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-base leading-7 text-gray-600">
                            {faq.answer}
                          </p>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
