import type { Material } from "@/redux/features/types/control-escolar/type";

// El backend hace borrado suave de materiales (deja `deleted_at`/`status: 0`
// en vez de quitar el registro), pero los endpoints de listado no siempre
// excluyen esos registros — filtramos aquí para que un material "eliminado"
// no siga apareciendo mientras el backend no lo haga.
export function isMaterialVisible(material: Material): boolean {
  return material.status !== 0 && !material.deleted_at;
}
