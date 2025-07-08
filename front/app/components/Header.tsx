import { Disclosure } from "@headlessui/react";
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  onSettingsClick: () => void;
};

export const Header: React.FC<Props> = ({ onSettingsClick }) => {
  return (
    <Disclosure as="nav" className="bg-background shadow-md border-b">
      <div className="mx-auto px-6">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center text-teal-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-auto text-teal-500"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </div>
            <div className="sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/"
                className="inline-flex items-center px-1 pt-1 font-medium text-gray-900"
              >
                Manga Translator
              </a>
            </div>
          </div>

          {/* Settings button on the right side */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onSettingsClick}
            title="Settings"
            className="cursor-pointer px-2 py-5 my-auto"
          >
            <Settings className="size-6" />
          </Button>
        </div>
      </div>
    </Disclosure>
  );
};
