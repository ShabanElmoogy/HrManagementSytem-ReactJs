import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventChangeArg } from "@fullcalendar/core";
import { useCreateAppointment, useDeleteAppointment, useAppointments, useUpdateAppointment } from "../hooks/useAppointmentQueries";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { showToast } from "@/shared/components/common/feedback/Toast";
import { alpha } from "@mui/material/styles";

const todayStart = dayjs().startOf("day");

// Note: CSS imports are removed due to package exports. Add styles via CDN in index.html if needed.

// Attractive dialog for adding a new appointment
type AddAppointmentDialogProps = {
  open: boolean;
  loading?: boolean;
  defaultStart: string;
  defaultEnd: string;
  onClose: () => void;
  onSubmit: (data: { text: string; start: string; end: string }) => void;
};

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  loading,
  defaultStart,
  defaultEnd,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>("");
  const [start, setStart] = useState<Dayjs | null>(dayjs(defaultStart));
  const [end, setEnd] = useState<Dayjs | null>(dayjs(defaultEnd));
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  React.useEffect(() => {
    setTitle("");
    setStart(dayjs(defaultStart));
    setEnd(dayjs(defaultEnd));
    setErrors({});
  }, [defaultStart, defaultEnd, open]);

  const validate = () => {
    const errs: { title?: string; time?: string } = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!start || !end) errs.time = "Start and End are required";
    else if (end.isBefore(start)) errs.time = "End must be after Start";
    else if (start.startOf("day").isBefore(todayStart)) errs.time = "Cannot create in past days";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      text: title.trim(),
      start: start!.format("YYYY-MM-DDTHH:mm"),
      end: end!.format("YYYY-MM-DDTHH:mm"),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Appointment</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Title"
            placeholder="What is this about?"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title || " "}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DateTimePicker
              label="Start"
              value={start}
              onChange={(v) => setStart(v)}
              minDateTime={todayStart}
              ampm={false}
              format="DD/MM/YYYY HH:mm"
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DateTimePicker
              label="End"
              value={end}
              onChange={(v) => setEnd(v)}
              minDateTime={todayStart}
              ampm={false}
              format="DD/MM/YYYY HH:mm"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>

          {errors.time && (
            <Typography color="error" variant="body2">
              {errors.time}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Add Appointment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AppointmentCalendar: React.FC = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultStart, setDefaultStart] = useState<string>(new Date().toISOString());
  const [defaultEnd, setDefaultEnd] = useState<string>(new Date(Date.now() + 60 * 60 * 1000).toISOString());
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");

  const events = useMemo(() => {
    if (currentView === "dayGridMonth") {
      return appointments.map((a) => {
        // Derive date-only in UTC to avoid local timezone day shifts in month view
        const sUTC = new Date(a.start).toISOString().slice(0, 10); // YYYY-MM-DD
        const eUTC = new Date(a.end || a.start).toISOString().slice(0, 10);
        const sDay = dayjs(sUTC);
        const eDay = dayjs(eUTC);
        const endExclusive = (eDay.isSame(sDay) || eDay.isBefore(sDay) ? sDay.add(1, "day") : eDay.add(1, "day")).format("YYYY-MM-DD");
        return {
          id: String(a.id),
          title: a.text,
          start: sUTC,
          end: endExclusive,
          allDay: true,
        };
      });
    }
    return appointments.map((a) => ({
      id: String(a.id),
      title: a.text,
      start: a.start,
      end: a.end,
    }));
  }, [appointments, currentView]);

  const onSelect = async (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const start = selectInfo.startStr;
    const isPast = dayjs(selectInfo.start).startOf("day").isBefore(todayStart);
    if (isPast) {
      showToast.warning("You cannot add appointments in previous days");
      return;
    }

    const end = selectInfo.endStr || new Date(selectInfo.start.getTime() + 60 * 60 * 1000).toISOString();

    setDefaultStart(start);
    setDefaultEnd(end);
    setDialogOpen(true);
  };

  const onCreate = (data: { text: string; start: string; end: string }) => {
    // Normalize create payload depending on view to avoid timezone day shifts
    if (currentView === "dayGridMonth") {
      const startDay = dayjs(data.start).format("YYYY-MM-DD");
      const endDay = dayjs(data.end).format("YYYY-MM-DD");
      // Save at UTC noon to avoid timezone-induced off-by-one day shifts
      createMutation.mutate(
        { start: `${startDay}T12:00:00Z`, end: `${endDay}T12:00:00Z`, text: data.text },
        { onSuccess: () => setDialogOpen(false) }
      );
      return;
    }

    // Timed views: keep precise local date-time without timezone suffix
    createMutation.mutate(
      { start: dayjs(data.start).format("YYYY-MM-DDTHH:mm:ss"), end: dayjs(data.end).format("YYYY-MM-DDTHH:mm:ss"), text: data.text },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  const onEventChange = (changeInfo: EventChangeArg) => {
    const e = changeInfo.event;
    const id = Number(e.id);

    // In month view/all-day, use date-only semantics and save at UTC noon to avoid day shifts
    if (e.allDay || currentView === "dayGridMonth") {
      const startStr = e.startStr; // YYYY-MM-DD
      const endStr = e.endStr || e.startStr; // YYYY-MM-DD (exclusive end)

      const invalidAllDay = dayjs(startStr).isBefore(todayStart) || dayjs(endStr).isBefore(todayStart);
      if (invalidAllDay) {
        changeInfo.revert();
        return;
      }

      const startIsoUtcNoon = `${startStr}T12:00:00Z`;
      const endIsoUtcNoon = `${endStr}T12:00:00Z`;
      updateMutation.mutate({ id, start: startIsoUtcNoon, end: endIsoUtcNoon, text: e.title });
      return;
    }

    // Timed events in timeGrid views
    const startDate = e.start ? dayjs(e.start) : dayjs();
    const endDate = e.end ? dayjs(e.end) : startDate;
    const isInvalid = startDate.startOf("day").isBefore(todayStart) || endDate.startOf("day").isBefore(todayStart);
    if (isInvalid) {
      changeInfo.revert();
      return;
    }

    updateMutation.mutate({ id, start: startDate.toISOString(), end: endDate.toISOString(), text: e.title });
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
    <Box
      sx={(theme) => ({
        p: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.9)
            : theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.06)",

        "& .fc": {
          // FullCalendar CSS variables to adapt to MUI theme
          "--fc-page-bg-color": theme.palette.background.default,
          "--fc-page-text-color": theme.palette.text.primary,
          "--fc-neutral-bg-color": theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
          "--fc-neutral-text-color": theme.palette.text.secondary,
          "--fc-border-color": theme.palette.divider,
          "--fc-list-event-hover-bg-color": alpha(theme.palette.primary.main, 0.1),
          "--fc-today-bg-color": alpha(theme.palette.primary.main, 0.15),
          "--fc-event-bg-color": theme.palette.primary.main,
          "--fc-event-border-color": theme.palette.primary.dark,
          "--fc-event-text-color": theme.palette.primary.contrastText,
          "--fc-button-bg-color": theme.palette.primary.main,
          "--fc-button-border-color": theme.palette.primary.dark,
          "--fc-button-text-color": theme.palette.primary.contrastText,
          "--fc-button-hover-bg-color": theme.palette.primary.dark,
          "--fc-button-active-bg-color": theme.palette.primary.dark,
          fontFamily: theme.typography.fontFamily,
        },

        // Toolbar and title
        "& .fc .fc-toolbar": {
          gap: 8,
        },
        "& .fc .fc-toolbar-title": {
          color: (theme.palette.text as any).primary,
          fontWeight: 700,
        },

        // Button enhancements (month/week/day/list + prev/next + today)
        "& .fc .fc-button": {
          textTransform: "none",
          borderRadius: 1.5,
          boxShadow: "none",
          backgroundColor: "transparent",
          color: (theme.palette.text as any).secondary,
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          transition: "all .2s ease",
          fontWeight: 600,
        },
        "& .fc .fc-button:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },
        "& .fc .fc-button.fc-button-active, & .fc .fc-button[aria-pressed=\"true\"]": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderColor: theme.palette.primary.dark,
        },
        "& .fc .fc-today-button": {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          borderColor: theme.palette.secondary.dark,
        },
        "& .fc .fc-today-button:hover": {
          backgroundColor: theme.palette.secondary.dark,
          borderColor: theme.palette.secondary.dark,
        },
        "& .fc .fc-button.fc-button-disabled, & .fc .fc-today-button.fc-button-disabled": {
          opacity: 0.6,
          backgroundColor: alpha(theme.palette.action.disabledBackground || theme.palette.divider, 0.08),
          color: theme.palette.text.disabled,
          borderColor: alpha(theme.palette.divider, 0.4),
        },
        "& .fc .fc-prev-button, & .fc .fc-next-button": {
          backgroundColor: "transparent",
          color: (theme.palette.text as any).secondary,
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        },
        "& .fc .fc-prev-button:hover, & .fc .fc-next-button:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },

        // Header and grid colors
        "& .fc .fc-col-header": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.02)
              : alpha(theme.palette.primary.main, 0.04),
        },
        "& .fc .fc-col-header-cell-cushion": {
          color: (theme.palette.text as any).secondary,
        },
        "& .fc .fc-daygrid-day-number": {
          color: (theme.palette.text as any).secondary,
        },
        "& .fc .fc-scrollgrid": {
          borderColor: theme.palette.divider,
          backgroundColor: "transparent",
          borderRadius: 1.5,
        },
        "& .fc .fc-timegrid-slot": {
          borderColor: theme.palette.divider,
        },
        "& .fc .fc-day-today": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        "& .fc .fc-list": {
          backgroundColor: "transparent",
        },
      })}
    >
      {isLoading ? (
        <div>Loading calendar...</div>
      ) : (
        <>
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
            eventStartEditable={true}
            eventDurationEditable={true}
            eventResizableFromStart={true}
            eventDisplay="block"
            events={events}
            select={onSelect}
            eventClick={onEventClick}
            eventChange={onEventChange}
            datesSet={(arg) => setCurrentView(arg.view.type)}
            height="auto"
          />

          <AddAppointmentDialog
            open={dialogOpen}
            loading={createMutation.isPending}
            defaultStart={defaultStart}
            defaultEnd={defaultEnd}
            onClose={() => setDialogOpen(false)}
            onSubmit={onCreate}
          />
        </>
      )}
    </Box>
  );
};

export default AppointmentCalendar;
