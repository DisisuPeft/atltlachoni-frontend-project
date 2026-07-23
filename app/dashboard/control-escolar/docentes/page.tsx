import { Suspense } from "react";
import DocentesTable from "@/app/components/control-escolar/docentes/docentes-table";

export default function DocentesPage() {
  return (
    <Suspense>
      <DocentesTable />
    </Suspense>
  );
}