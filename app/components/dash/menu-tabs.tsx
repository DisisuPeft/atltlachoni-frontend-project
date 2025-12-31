"use client";

import { useEffect, useState } from "react";
import Tabs from "@/app/ui/components/tabs";
import {
  // useRetrieveUserQuery,
  useGetPestaniaQuery,
} from "@/redux/features/auth/authApiSlice";
import { Pestanias } from "@/redux/features/types/auth/auth-types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function TabsPanelWrapper() {
  const searchParams = useSearchParams();
  const q = searchParams.get("ref");
  const { data: pestanias, isLoading } = useGetPestaniaQuery(q);
  const [activeTab, setActiveTab] = useState<Pestanias | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pestanias && !isLoading) {
      setActiveTab((prev) => prev ?? pestanias[0]);
    }
  }, [pestanias]);

  useEffect(() => {
    if (pestanias && pathname) {
      const tabActual = pestanias.find((tab) => pathname.includes(tab.href));
      if (tabActual) {
        setActiveTab(tabActual);
      }
    }
  }, [pestanias, pathname]);

  const handleActiveTabChange = (tab: Pestanias) => {
    setActiveTab(tab);
    router.push(`${tab.href}?ref=${q}`);
  };

  if (isLoading || !activeTab) {
    return <div className="p-4">Cargando tabs...</div>;
  }

  return (
    <Tabs
      tabs={pestanias ?? []}
      activeTab={activeTab}
      setActiveTab={handleActiveTabChange}
    />
  );
}
