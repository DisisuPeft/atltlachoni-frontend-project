"use client";
import { useState } from "react";

export default function useMyCalender() {
  // Estado para el calendario
  const [fechaActual, setFechaActual] = useState(new Date());

  // Funciones para navegar entre meses
  const mesAnterior = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1),
    );
  };

  const mesSiguiente = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1),
    );
  };

  // Generar días del mes
  const generarDiasMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0);

    // Día de la semana del primer día (0=Dom, 1=Lun, ..., 6=Sab)
    let primerDiaSemana = primerDia.getDay();
    // Ajustar para que Lunes sea 0
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    const diasEnMes = ultimoDia.getDate();

    // Generar array de semanas
    const semanas: number[][] = [];
    let semanaActual: number[] = [];

    // Llenar días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
      semanaActual.push(0);
    }

    // Llenar días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      semanaActual.push(dia);

      if (semanaActual.length === 7) {
        semanas.push(semanaActual);
        semanaActual = [];
      }
    }

    // Llenar días vacíos al final
    if (semanaActual.length > 0) {
      while (semanaActual.length < 7) {
        semanaActual.push(0);
      }
      semanas.push(semanaActual);
    }

    return semanas;
  };

  // Verificar si es el día de hoy
  const esDiaActual = (dia: number) => {
    const hoy = new Date();
    return (
      dia === hoy.getDate() &&
      fechaActual.getMonth() === hoy.getMonth() &&
      fechaActual.getFullYear() === hoy.getFullYear()
    );
  };

  // Obtener nombre del mes
  const nombreMes = fechaActual.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const diasMes = generarDiasMes();

  return {
    mesAnterior,
    mesSiguiente,
    esDiaActual,
    nombreMes,
    diasMes,
  };
}
