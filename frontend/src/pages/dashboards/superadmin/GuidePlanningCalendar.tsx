import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, UserRound } from "lucide-react";
import { Calendar } from "../../../app/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../app/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../app/components/ui/popover";
import { Button } from "../../../app/components/ui/button";
import { cn } from "../../../app/components/ui/utils";
import { guidesByDate } from "./superAdminData";

function parseDateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export default function GuidePlanningCalendar() {
  const [selected, setSelected] = useState<Date | undefined>(() => new Date(2026, 3, 1));
  const [popoverOpen, setPopoverOpen] = useState(false);

  const datesWithGuides = useMemo(
    () =>
      Object.keys(guidesByDate).map((k) => {
        const [y, m, d] = k.split("-").map(Number);
        return new Date(y, m - 1, d);
      }),
    [],
  );

  const selectedKey = selected ? parseDateKey(selected) : "";
  const assignments = selectedKey ? guidesByDate[selectedKey] ?? [] : [];

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      const key = parseDateKey(date);
      const has = guidesByDate[key]?.length;
      if (has) setPopoverOpen(true);
      else setPopoverOpen(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <Card className="rounded-3xl border border-white/30 bg-white/40 shadow-sm backdrop-blur-md">
        <CardHeader className="border-b border-[#A31D1D]/10">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-[#A31D1D]" strokeWidth={1.75} />
            <div>
              <CardTitle className="text-lg">Guide planning</CardTitle>
              <CardDescription>
                Select a day to see which guides are scheduled and their activities.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-center">
            <div
              className={cn(
                "rounded-2xl border border-white/30 bg-white/20 p-2 backdrop-blur-md",
                "[--cell-size:2.25rem]",
              )}
            >
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(d) => handleSelect(d ?? undefined)}
                modifiers={{ hasGuides: datesWithGuides }}
                modifiersClassNames={{
                  hasGuides:
                    "relative font-medium after:absolute after:bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#A31D1D]",
                }}
                classNames={{
                  day: "h-9 w-9 p-0 font-semibold text-slate-900 aria-selected:opacity-100 hover:bg-white/40 rounded-lg",
                  head_cell: "text-[#A31D1D] font-bold text-[0.8rem] w-9",
                  day_selected:
                    "bg-[#A31D1D] text-white hover:bg-[#A31D1D] hover:text-white focus:bg-[#A31D1D] focus:text-white rounded-lg",
                  day_today: "bg-white/60 text-[#A31D1D] font-bold rounded-lg",
                  nav_button:
                    "h-8 w-8 rounded-lg border border-white/50 text-[#A31D1D] hover:bg-white/40 bg-white/20 shadow-sm",
                  caption_label: "text-base font-bold text-[#A31D1D]",
                }}
                className="rounded-2xl bg-transparent"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center md:hidden">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-[#A31D1D]/30 text-[#A31D1D]"
                  disabled={assignments.length === 0}
                >
                  Guides on this day ({assignments.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-xl border-[#A31D1D]/15 p-0" align="center">
                <GuideList assignments={assignments} dateLabel={selected ? format(selected, "PPP") : ""} />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden rounded-3xl border border-white/30 bg-white/40 shadow-sm backdrop-blur-md lg:flex lg:flex-col">
        <CardHeader className="border-b border-[#A31D1D]/10">
          <CardTitle className="text-base">
            {selected ? format(selected, "EEEE d MMMM yyyy") : "Pick a date"}
          </CardTitle>
          <CardDescription>
            {assignments.length
              ? `${assignments.length} guide${assignments.length > 1 ? "s" : ""} on duty`
              : "No guides scheduled for this day."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <GuideList assignments={assignments} dateLabel={selected ? format(selected, "PPP") : ""} />
        </CardContent>
      </Card>
    </div>
  );
}

function GuideList({
  assignments,
  dateLabel,
}: {
  assignments: Array<{ guideName: string; activity: string; city: string; guideId: string }>;
  dateLabel: string;
}) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-sm text-slate-500">
        <UserRound className="size-10 text-slate-300" />
        <p>No guide assignments for {dateLabel || "this date"}.</p>
      </div>
    );
  }

  return (
    <ul className="max-h-[min(420px,55vh)] divide-y divide-[#A31D1D]/10 overflow-y-auto p-3">
      {assignments.map((g) => (
        <li key={`${g.guideId}-${g.activity}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: "#A31D1D" }}
          >
            {g.guideName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">{g.guideName}</p>
            <p className="text-sm font-medium text-slate-700">{g.activity}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3.5 shrink-0" />
              {g.city}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
