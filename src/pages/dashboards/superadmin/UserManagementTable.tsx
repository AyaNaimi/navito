import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../../app/components/ui/badge";
import { Button } from "../../../app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { Label } from "../../../app/components/ui/label";
import { ScrollArea } from "../../../app/components/ui/scroll-area";
import { Separator } from "../../../app/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../app/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../app/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../app/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../../../app/components/ui/avatar";
import { moroccoSuperAdminUsers } from "./superAdminData";
import { MTA_GREEN, MTA_RED } from "./mtaTheme";
import type { MoroccoUserRow } from "./superAdminTypes";

type RoleFilter = "all" | "tourist" | "guide" | "driver";
type RatingFilter = "all" | "gte4" | "gte45" | "gte49";

function statusBadgeVariant(
  status: MoroccoUserRow["status"],
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
    case "verified":
      return "outline";
    case "pending":
      return "secondary";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

function UserDetailSheet({
  user,
  open,
  onOpenChange,
}: {
  user: MoroccoUserRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {user ? (
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader
            className="border-b pb-4 text-left"
            style={{ borderColor: `${MTA_RED}18` }}
          >
            <div className="flex items-start gap-4">
              <Avatar
                className="size-16 rounded-xl border-2"
                style={{ borderColor: `${MTA_GREEN}35` }}
              >
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback
                  className="rounded-xl text-lg font-semibold"
                  style={{ backgroundColor: `${MTA_GREEN}14`, color: MTA_GREEN }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <SheetTitle className="text-xl">{user.name}</SheetTitle>
                <SheetDescription className="truncate text-base">{user.email}</SheetDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="capitalize"
                    style={{ borderColor: `${MTA_RED}40`, color: MTA_RED }}
                  >
                    {user.role}
                  </Badge>
                  <Badge variant={statusBadgeVariant(user.status)} className="capitalize">
                    {user.status}
                  </Badge>
                  {user.role === "driver" && user.rating != null ? (
                    <Badge
                      variant="outline"
                      className="border-[#006233]/30 text-[#006233]"
                    >
                      {user.rating.toFixed(1)} ★
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 p-4">
            <div
              className="rounded-xl border bg-white p-4 shadow-sm"
              style={{ borderColor: `${MTA_GREEN}18` }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Registration</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(user.registrationDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Account status</p>
              <p className="mt-1 capitalize text-slate-800">{user.status.replace("_", " ")}</p>
            </div>

            {user.adminDecisionAt ? (
              <div
                className="rounded-xl border bg-white p-4 shadow-sm"
                style={{ borderColor: `${MTA_GREEN}22` }}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Décision admin
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {new Date(user.adminDecisionAt).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ) : null}

            <Separator style={{ backgroundColor: `${MTA_RED}14` }} />

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">Booking history</p>
              {user.bookingHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No bookings recorded yet.</p>
              ) : (
                <ScrollArea className="h-[min(280px,40vh)] pr-3">
                  <ul className="space-y-3">
                    {user.bookingHistory.map((b) => (
                      <li
                        key={b.id}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-slate-900">{b.title}</span>
                          <Badge variant="secondary" className="shrink-0 capitalize">
                            {b.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{b.date}</p>
                        <p className="text-[11px] text-slate-400">{b.id}</p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
          </div>
        </SheetContent>
      ) : null}
    </Sheet>
  );
}

function matchesRatingFilter(user: MoroccoUserRow, ratingFilter: RatingFilter): boolean {
  if (user.role !== "driver" || user.rating == null) {
    return ratingFilter === "all";
  }
  const r = user.rating;
  switch (ratingFilter) {
    case "gte4":
      return r >= 4;
    case "gte45":
      return r >= 4.5;
    case "gte49":
      return r >= 4.9;
    default:
      return true;
  }
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<MoroccoUserRow[]>(() => [...moroccoSuperAdminUsers]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [selected, setSelected] = useState<MoroccoUserRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (roleFilter === "driver") {
      list = list.filter((u) => matchesRatingFilter(u, ratingFilter));
    }
    return list;
  }, [users, roleFilter, ratingFilter]);

  const openFor = (user: MoroccoUserRow) => {
    setSelected(user);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (next: boolean) => {
    setSheetOpen(next);
    if (!next) {
      setSelected(null);
    }
  };

  const handleValidate = (user: MoroccoUserRow) => {
    const decidedAt = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: "verified" as const, adminDecisionAt: decidedAt }
          : u,
      ),
    );
    if (selected?.id === user.id) {
      setSelected({ ...user, status: "verified", adminDecisionAt: decidedAt });
    }
    toast.success("Compte validé", { description: user.email });
  };

  const handleRefuse = (user: MoroccoUserRow) => {
    const decidedAt = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: "suspended" as const, adminDecisionAt: decidedAt }
          : u,
      ),
    );
    if (selected?.id === user.id) {
      setSelected({ ...user, status: "suspended", adminDecisionAt: decidedAt });
    }
    toast.error("Compte refusé", { description: user.email });
  };

  const decisionLabel = (status: MoroccoUserRow["status"]) => {
    if (status === "verified") return "Validé";
    if (status === "suspended") return "Refusé";
    return status;
  };

  return (
    <>
      <Card
        className="overflow-hidden rounded-3xl border border-white/30 shadow-sm backdrop-blur-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
      >
        <CardHeader className="space-y-4 border-b pb-4" style={{ borderColor: `${MTA_GREEN}15` }}>
          <div>
            <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Filtrez par rôle ; pour les conducteurs, affinez par note. Validez ou refusez les comptes en attente.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="grid w-full gap-2 sm:w-[200px]">
              <Label htmlFor="filter-role" className="text-xs text-slate-600">
                Rôle
              </Label>
              <Select
                value={roleFilter}
                onValueChange={(v) => {
                  setRoleFilter(v as RoleFilter);
                  if (v !== "driver") {
                    setRatingFilter("all");
                  }
                }}
              >
                <SelectTrigger id="filter-role" className="rounded-xl border-[#006233]/25">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="tourist">Touriste</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="driver">Conducteur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {roleFilter === "driver" ? (
              <div className="grid w-full gap-2 sm:w-[220px]">
                <Label htmlFor="filter-rating" className="text-xs text-slate-600">
                  Note (conducteurs)
                </Label>
                <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v as RatingFilter)}>
                  <SelectTrigger id="filter-rating" className="rounded-xl border-[#006233]/25">
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="gte4">≥ 4.0</SelectItem>
                    <SelectItem value="gte45">≥ 4.5</SelectItem>
                    <SelectItem value="gte49">≥ 4.9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent" style={{ borderColor: `${MTA_RED}10` }}>
                  <TableHead className="text-slate-600">Nom</TableHead>
                  <TableHead className="text-slate-600">Email</TableHead>
                  <TableHead className="text-slate-600">Rôle</TableHead>
                  <TableHead className="text-slate-600">Note</TableHead>
                  <TableHead className="text-slate-600">Statut</TableHead>
                  <TableHead className="min-w-[260px] text-center text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                      Aucun utilisateur ne correspond aux filtres.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} style={{ borderColor: `${MTA_RED}10` }}>
                      <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-600">{user.email}</TableCell>
                      <TableCell className="capitalize text-slate-700">{user.role}</TableCell>
                      <TableCell className="text-slate-700">
                        {user.role === "driver" && user.rating != null ? (
                          <span className="font-medium tabular-nums" style={{ color: MTA_GREEN }}>
                            {user.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(user.status)} className="capitalize">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col items-center justify-center gap-2 px-1 py-1 text-center">
                          {user.status === "pending" ? (
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              <Button
                                type="button"
                                size="sm"
                                className="rounded-xl text-white"
                                style={{ backgroundColor: MTA_GREEN }}
                                onClick={() => handleValidate(user)}
                              >
                                Valider
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-xl border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => handleRefuse(user)}
                              >
                                Refuser
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-xl"
                                style={{ borderColor: `${MTA_RED}40`, color: MTA_RED }}
                                onClick={() => openFor(user)}
                              >
                                Voir Plus
                              </Button>
                            </div>
                          ) : (
                            <>
                              {user.adminDecisionAt ? (
                                <p className="max-w-[220px] text-xs leading-relaxed text-slate-600">
                                  <span className="font-semibold text-slate-800">
                                    {decisionLabel(user.status)}
                                  </span>
                                  {" — "}
                                  {new Date(user.adminDecisionAt).toLocaleString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              ) : null}
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-xl"
                                style={{ borderColor: `${MTA_RED}40`, color: MTA_RED }}
                                onClick={() => openFor(user)}
                              >
                                Voir Plus
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserDetailSheet
        user={
          selected
            ? users.find((u) => u.id === selected.id) ?? selected
            : null
        }
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </>
  );
}
