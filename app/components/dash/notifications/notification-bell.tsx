"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Loader2, UserPlus } from "lucide-react";
import {
  useVerifyUserQuery,
  useRetrieveUserQuery,
} from "@/redux/features/auth/authApiSlice";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationReadMutation,
} from "@/redux/features/notifications/notificationsApiSlice";
import type { Notification } from "@/redux/features/types/notifications/type";

const UNREAD_POLL_MS = 30_000;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "justo ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function NotificationItem({
  notification,
  onNavigate,
}: {
  notification: Notification;
  onNavigate: (notification: Notification) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(notification)}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
        !notification.leido ? "bg-[#F0F6FF]/60" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <UserPlus className="w-4 h-4 text-[#0056D2]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 truncate">
          <span className="font-semibold">{notification.nombre_lead}</span>{" "}
          es un nuevo lead
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {notification.diplomado ?? "Sin programa asignado"}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {timeAgo(notification.creado_en)}
        </p>
      </div>
      {!notification.leido && (
        <span className="w-2 h-2 rounded-full bg-[#0056D2] flex-shrink-0 mt-1.5" />
      )}
    </button>
  );
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: verify } = useVerifyUserQuery();
  const { data: user } = useRetrieveUserQuery();
  const isAdmin =
    verify?.superuser || verify?.roles?.some((r) => r.nombre === "Administrador");

  const { data: unread } = useGetUnreadNotificationsCountQuery(undefined, {
    skip: !isAdmin,
    pollingInterval: UNREAD_POLL_MS,
  });
  const { data: notifications, isLoading } = useGetNotificationsQuery(
    { page: 1 },
    { skip: !isAdmin || !open },
  );
  const [markAsRead] = useMarkNotificationReadMutation();

  const crmModule = user?.modulos_accesibles?.find(
    (m) => m.href === "/dashboard/crm" || m.href.startsWith("/dashboard/crm/"),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  if (!isAdmin) return null;

  const count = unread?.count ?? 0;

  const handleNavigate = (notification: Notification) => {
    setOpen(false);
    if (!notification.leido) markAsRead(notification.id);
    const query = crmModule?.uuid ? `?ref=${crmModule.uuid}` : "";
    router.push(`/dashboard/crm/detalle-lead/${notification.lead_uuid}${query}`);
  };

  const items = notifications?.results ?? [];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        aria-expanded={open}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:ring-offset-2"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[28rem] flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Notificaciones
            </p>
            {count > 0 && (
              <span className="text-xs text-gray-400">
                {count} sin leer
              </span>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No hay notificaciones
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
