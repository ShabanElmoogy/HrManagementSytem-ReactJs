import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventChangeArg } from "@fullcalendar/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "@/shared/services/apiService";
import apiRoutes from "@/routes/apiRoutes";
import { extractValue, extractValues } from "@/shared/utils/ApiHelper";

// Styles: FullCalendar CSS imports removed because packages don't export CSS in this setup.
// If you need default styles, include them via your global CSS or CDN.

// Types
export type Appointment = {
  id: number;
  start: string; // ISO string
  end: string;   // ISO string
  text: string;
};

export type CreateAppointmentRequest = {
  start: string; // ISO string
  end: string;   // ISO string
  text: string;
};

export type UpdateAppointmentRequest = {
  id: number;
  start: string; // ISO string
  end: string;   // ISO string
  text: string;
};

// Query Keys
export const appointmentKeys = {
  all: ["appointments"] as const,
  list: () => [...appointmentKeys.all, "list"] as const,
  detail: (id: number) => [...appointmentKeys.all, "detail", id] as const,
};

// Service
const AppointmentService = {
  async getAll(): Promise<Appointment[]> {
    const response = await apiService.get(apiRoutes.appointments.getAll);
    const list = extractValues<Appointment>(response);
    // Ensure fields are present and convert date to ISO if needed
    return (list || []).map(x => ({
      id: (x as any).id ?? (x as any).Id ?? 0,
      start: (x as any).start ?? (x as any).Start,
      end: (x as any).end ?? (x as any).End,
      text: (x as any).text ?? (x as any).Text,
    }));
  },

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiService.post(apiRoutes.appointments.add, {
      start: data.start,
      end: data.end,
      text: data.text,
      id: 0,
    });
    const created = extractValue<Appointment>(response);
    return {
      id: (created as any).id ?? (created as any).Id ?? 0,
      start: (created as any).start ?? (created as any).Start,
      end: (created as any).end ?? (created as any).End,
      text: (created as any).text ?? (created as any).Text,
    };
  },

  async update(data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiService.put(apiRoutes.appointments.update, {
      id: data.id,
      start: data.start,
      end: data.end,
      text: data.text,
    });
    const updated = extractValue<Appointment>(response);
    return {
      id: (updated as any).id ?? (updated as any).Id ?? data.id,
      start: (updated as any).start ?? (updated as any).Start ?? data.start,
      end: (updated as any).end ?? (updated as any).End ?? data.end,
      text: (updated as any).text ?? (updated as any).Text ?? data.text,
    };
  },

  async delete(id: number): Promise<number> {
    await apiService.delete(apiRoutes.appointments.delete(id));
    return id;
  },
};

// TanStack Query Hooks
export const useAppointments = () =>
  useQuery({
    queryKey: appointmentKeys.list(),
    queryFn: AppointmentService.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AppointmentService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all as any });
    },
  });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AppointmentService.update,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all as any });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(data.id) as any });
    },
  });
};

export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AppointmentService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all as any });
    },
  });
};

// Component: FullCalendar integration
export const AppointmentCalendar: React.FC = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  const events = useMemo(() => {
    return appointments.map((a) => ({
      id: String(a.id),
      title: a.text,
      start: a.start,
      end: a.end,
    }));
  }, [appointments]);

  const onSelect = async (selectInfo: DateSelectArg) => {
    const title = window.prompt("Enter event title");
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const start = selectInfo.startStr;
      const end = selectInfo.endStr || new Date(selectInfo.start.getTime() + 60 * 60 * 1000).toISOString();
      createMutation.mutate({ start, end, text: title });
    }
  };

  const onEventChange = (changeInfo: EventChangeArg) => {
    const e = changeInfo.event;
    const id = Number(e.id);
    const start = e.start ? e.start.toISOString() : new Date().toISOString();
    const end = e.end ? e.end.toISOString() : start;
    updateMutation.mutate({ id, start, end, text: e.title });
  };

  const onEventClick = (clickInfo: EventClickArg) => {
    const id = Number(clickInfo.event.id);
    const currentTitle = clickInfo.event.title;
    const action = window.prompt("Edit title or type DELETE to remove", currentTitle);

    if (action === null) return;

    if (action?.toUpperCase() === "DELETE") {
      if (window.confirm("Are you sure you want to delete this event?")) {
        deleteMutation.mutate(id);
      }
      return;
    }

    const start = clickInfo.event.start ? clickInfo.event.start.toISOString() : new Date().toISOString();
    const end = clickInfo.event.end ? clickInfo.event.end.toISOString() : start;
    updateMutation.mutate({ id, start, end, text: action || currentTitle });
  };

  return (
    <div style={{ padding: 16 }}>
      {isLoading ? (
        <div>Loading calendar...</div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          selectable
          selectMirror
          editable
          events={events}
          select={onSelect}
          eventClick={onEventClick}
          eventChange={onEventChange}
          height="auto"
        />
      )}
    </div>
  );
};

// Page wrapper
const AppointmentsPage: React.FC = () => {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <AppointmentCalendar />
    </div>
  );
};

export default AppointmentsPage;
