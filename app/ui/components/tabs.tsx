"use client";
import { Pestanias } from "@/redux/features/types/auth/auth-types";

interface TabsProps {
  tabs: Pestanias[];
  activeTab: Pestanias | undefined;
  setActiveTab: (tab: Pestanias) => void;
}

export default function Tabs({ tabs, activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="border-b border-gray-200 ml-[100px]">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab?.id === tab.id;
          return (
            <button
              key={tab.uuid}
              onClick={() => setActiveTab(tab)}
              className={`${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xl transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-t-md font-serif cursor-pointer`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.nombre}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
