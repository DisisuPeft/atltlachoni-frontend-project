"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  path: string;
  title: string;
}

export default function ButtonLink({ path, title }: Props) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  return (
    <Link
      href={`${path}?ref=${ref}`}
      className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
    >
      {title}
    </Link>
  );
}
