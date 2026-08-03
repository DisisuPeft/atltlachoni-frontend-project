export type NotificationTipo = "nuevo_lead";

export interface Notification {
  id: number;
  lead: number;
  lead_uuid: string;
  tipo: NotificationTipo;
  leido: boolean;
  creado_en: string;
  nombre_lead: string;
  diplomado: string | null;
}

/** Payload que llega por el WebSocket (wss://.../ws/notifications/). Mismos
 * datos que un item de GET /notifications/, con nombres distintos: siempre
 * es un "nuevo lead", no trae un campo de tipo de evento. */
export interface NotificationSocketPayload {
  notification_id: number;
  lead_id: number;
  lead_uuid: string;
  nombre_lead: string;
  diplomado: string | null;
  timestamp: string;
}
