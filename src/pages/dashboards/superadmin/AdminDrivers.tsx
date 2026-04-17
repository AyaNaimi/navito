import { useEffect, useState } from "react";
import {
  Car,
  Search,
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  Mail,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
  UserX,
  Eye,
  ShieldCheck,
  AlertCircle,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";
import { toast } from "sonner";
import { useAppContext } from "../../../app/context/AppContext";
import { fetchPendingDrivers, updateDriverApproval, type ApiPendingDriver } from "../../../app/services/api";

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
  status: "verified" | "pending" | "rejected";
  joined: string;
  vehicle: string;
  license: string;
  avatar: string;
  documents: { name: string; verified: boolean; url?: string }[];
};

const initialDrivers: Driver[] = [
  {
    id: "D-001",
    name: "Youssef Alami",
    email: "youssef.a@mta.ma",
    phone: "+212 661 123 456",
    city: "Marrakech",
    rating: 4.8,
    status: "verified",
    joined: "15 Jan 2024",
    vehicle: "Mercedes Class V",
    license: "B — Exp. 2028",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Youssef",
    documents: [
      { name: "Permis de conduire", verified: true },
      { name: "Carte CIN", verified: true },
      { name: "Assurance Professionnelle", verified: true },
      { name: "Contrôle Technique", verified: true },
    ],
  },
  {
    id: "D-003",
    name: "Karim El Fassi",
    email: "karim.e@mta.ma",
    phone: "+212 661 789 012",
    city: "Tanger",
    rating: 4.9,
    status: "verified",
    joined: "20 Mar 2024",
    vehicle: "Range Rover Sport",
    license: "B — Exp. 2029",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Karim",
    documents: [
      { name: "Permis de conduire", verified: true },
      { name: "Carte CIN", verified: true },
      { name: "Assurance Professionnelle", verified: true },
      { name: "Contrôle Technique", verified: true },
    ],
  },
  {
    id: "D-004",
    name: "Mustapha Mansouri",
    email: "mustapha.m@mta.ma",
    phone: "+212 661 345 678",
    city: "Agadir",
    rating: 4.7,
    status: "verified",
    joined: "10 Feb 2024",
    vehicle: "Volkswagen Multivan",
    license: "B — Exp. 2027",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mustapha",
    documents: [
      { name: "Permis de conduire", verified: true },
      { name: "Carte CIN", verified: true },
      { name: "Assurance Professionnelle", verified: false },
      { name: "Contrôle Technique", verified: true },
    ],
  },
];

type PendingDriver = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
  submittedAt: string;
  avatar: string;
  documents: { name: string; submitted: boolean }[];
};

const initialPending: PendingDriver[] = [
  {
    id: "P-D-001",
    name: "Omar Tazi",
    email: "omar.t@mta.ma",
    phone: "+212 660 234 567",
    city: "Casablanca",
    vehicle: "Toyota Prado",
    submittedAt: "Today, 09:14 AM",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Omar",
    documents: [
      { name: "Permis de conduire", submitted: true },
      { name: "Carte CIN", submitted: true },
      { name: "Assurance Professionnelle", submitted: true },
      { name: "Contrôle Technique", submitted: false },
    ],
  },
  {
    id: "P-D-002",
    name: "Rachid Belmahi",
    email: "rachid.b@mta.ma",
    phone: "+212 660 876 543",
    city: "Rabat",
    vehicle: "Ford Transit",
    submittedAt: "Yesterday, 03:22 PM",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rachid",
    documents: [
      { name: "Permis de conduire", submitted: true },
      { name: "Carte CIN", submitted: true },
      { name: "Assurance Professionnelle", submitted: true },
      { name: "Contrôle Technique", submitted: true },
    ],
  },
];

export default function AdminDrivers({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const { authToken } = useAppContext();
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [pending, setPending] = useState<PendingDriver[]>(initialPending);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDocDriver, setViewDocDriver] = useState<PendingDriver | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{name: string; url: string} | null>(null);

  useEffect(() => {
    if (!authToken) return;

    fetchPendingDrivers(authToken)
      .then((response) => {
        const livePending = (response.data ?? []).map((item: ApiPendingDriver): PendingDriver => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone ?? "N/A",
          city: item.city ?? "N/A",
          vehicle: item.vehicle_type ?? "Vehicle not provided",
          submittedAt: item.submitted_at ? new Date(item.submitted_at).toLocaleString() : "Pending",
          avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item.name)}`,
          documents: [
            { name: "Permis de conduire", submitted: true },
            { name: "Carte CIN", submitted: true },
            { name: "Assurance Professionnelle", submitted: true },
            { name: "Contrôle Technique", submitted: true },
          ],
        }));
        setPending(livePending);
      })
      .catch(() => {
        // Keep local mock fallback for demo mode.
      });
  }, [authToken]);

  const filtered = drivers
    .filter((d) => d.status === "verified")
    .filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleConfirm = async (p: PendingDriver) => {
    if (authToken && typeof p.id === "number") {
      await updateDriverApproval(p.id, "verified", authToken).catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to approve driver.");
      });
    }

    const newDriver: Driver = {
      id: "D-" + String(drivers.length + 1).padStart(3, "0"),
      name: p.name,
      email: p.email,
      phone: p.phone,
      city: p.city,
      rating: 5.0,
      status: "verified",
      joined: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      vehicle: p.vehicle,
      license: "B — Exp. 2029",
      avatar: p.avatar,
      documents: p.documents.map((d) => ({ name: d.name, verified: d.submitted })),
    };
    setDrivers((prev) => [...prev, newDriver]);
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    toast.success("Driver approved.");
  };

  const handleReject = async (id: string | number) => {
    if (authToken && typeof id === "number") {
      await updateDriverApproval(id, "rejected", authToken).catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to reject driver.");
      });
    }
    setPending((prev) => prev.filter((x) => x.id !== id));
    toast.success("Driver request rejected.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Driver Management</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Oversee the transport fleet and partners across Morocco.
          </p>
        </div>
      </section>

      {/* Pending Registrations */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-7 rounded-full bg-orange-100 text-orange-500">
              <Clock className="size-4" />
            </div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
              Pending Registrations
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 text-[10px] font-black border border-orange-100">
              {pending.length} awaiting review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card top banner */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-300 to-amber-400" />

                <div className="p-6 space-y-4">
                  {/* Identity */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="size-14 rounded-2xl bg-slate-100 border-2 border-orange-100"
                      />
                      <span className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full bg-orange-400 border-2 border-white">
                        <Clock className="size-2.5 text-white" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                      <p className="text-[11px] font-bold text-slate-400">{p.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="size-3 text-[#0da08b]" />
                        <span className="text-[11px] font-bold text-slate-500">{p.city}</span>
                        <span className="mx-1 text-slate-200">·</span>
                        <Car className="size-3 text-[#0da08b]" />
                        <span className="text-[11px] font-bold text-slate-500">{p.vehicle}</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <p className="text-[10px] font-bold text-slate-400 text-right">Submitted</p>
                      <p className="text-[10px] font-black text-slate-600 text-right">{p.submittedAt}</p>
                    </div>
                  </div>

                  {/* Documents status */}
                  <div className="flex gap-2 flex-wrap">
                    {p.documents.map((doc) => (
                      <span
                        key={doc.name}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border",
                          doc.submitted
                            ? "bg-teal-50 text-[#0da08b] border-teal-100"
                            : "bg-red-50 text-red-400 border-red-100"
                        )}
                      >
                        {doc.submitted ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <AlertCircle className="size-3" />
                        )}
                        {doc.name}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => handleConfirm(p)}
                      className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl bg-[#0da08b] text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] active:scale-95 transition-all"
                    >
                      <UserCheck className="size-4" />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                    >
                      <UserX className="size-4" />
                      Cancel
                    </button>
                    <button
                      onClick={() => { setViewDocDriver(p); setShowDocModal(true); }}
                      className="h-11 px-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 active:scale-95 transition-all"
                    >
                      <Eye className="size-4" />
                      View Docs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Drivers Table */}
      <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-[#0da08b]" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Verified Drivers</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#0da08b] text-[10px] font-black border border-teal-100">
                {filtered.length} active
              </span>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-slate-50 border-0 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-10">Driver</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rating</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm font-bold">
                      No verified drivers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDriver(d)}
                      className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="p-6 pl-10">
                        <div className="flex items-center gap-4">
                          <img
                            src={d.avatar}
                            className="size-10 rounded-xl bg-slate-100 border border-slate-200 group-hover:border-[#0da08b]/40 transition-colors"
                            alt={d.name}
                          />
                          <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-[#0da08b] transition-colors uppercase tracking-tight">
                              {d.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-[#0da08b]" />
                          {d.city}
                        </div>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-900">{d.vehicle}</td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-black text-[#0da08b]">
                          <Star className="size-3 fill-[#0da08b]" /> {d.rating}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 bg-teal-50 text-[#0da08b]">
                          <CheckCircle2 className="size-3" /> Verified
                        </span>
                      </td>
                      <td className="p-6 pr-10 text-right text-slate-200 group-hover:text-[#0da08b] transition-colors">
                        <ChevronRight className="size-5" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedDriver(null)}
          />
          <div className="relative w-full max-w-2xl rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Photo */}
              <div className="md:col-span-2 bg-slate-900 overflow-hidden relative min-h-[240px]">
                <img src={selectedDriver.avatar} className="size-full object-cover opacity-80" alt="Avatar" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    {selectedDriver.name}
                  </h3>
                  <p className="text-[#0da08b] font-black text-xs uppercase tracking-widest mt-2">
                    {selectedDriver.vehicle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="absolute left-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Info */}
              <div className="md:col-span-3 p-10 space-y-7 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[9px] font-black text-[#0da08b] uppercase tracking-widest border border-teal-100">
                    <CheckCircle2 className="size-3" /> Certified Driver
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">ID: {selectedDriver.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                      Identity
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Mail className="size-4 text-[#0da08b]" /> {selectedDriver.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Phone className="size-4 text-[#0da08b]" /> {selectedDriver.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <MapPin className="size-4 text-[#0da08b]" /> {selectedDriver.city}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                      Documents
                    </h4>
                    <div className="space-y-2">
                      {selectedDriver.documents.map((doc) => (
                        <div
                          key={doc.name}
                          className="flex items-center justify-between text-xs font-bold text-slate-900 p-2 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <span>{doc.name}</span>
                          {doc.verified ? (
                            <CheckCircle2 className="size-3 text-[#0da08b]" />
                          ) : (
                            <AlertCircle className="size-3 text-orange-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                    Statistics
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#0da08b]/5 border border-[#0da08b]/10 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rides</p>
                      <p className="text-sm font-black text-[#0da08b]">412</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0da08b]/5 border border-[#0da08b]/10 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                      <p className="text-sm font-black text-[#0da08b]">{selectedDriver.rating}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0da08b]/5 border border-[#0da08b]/10 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-[9px] font-black text-[#0da08b] uppercase">Active</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-4">
                  <button
                    onClick={() => { setSelectedDriver(null); onNavigate("messages"); }}
                    className="flex-1 h-12 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => {
                      setViewDocDriver(null);
                      setShowDocModal(true);
                    }}
                    className="flex-1 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="size-4" /> Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Viewer Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowDocModal(false)}
          />
          <div className="relative w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 space-y-6">
            <button
              onClick={() => setShowDocModal(false)}
              className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
            >
              <X className="size-5" />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b]/10 text-[#0da08b]">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {viewDocDriver ? viewDocDriver.name : selectedDriver?.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Document Dossier</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {(viewDocDriver ? viewDocDriver.documents.map(d => ({ name: d.name, verified: d.submitted })) : selectedDriver?.documents ?? []).map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#0da08b]/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white border border-slate-100 text-[#0da08b] shadow-sm">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{doc.name}</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", doc.verified ? "text-[#0da08b]" : "text-orange-400")}>
                        {doc.verified ? "✓ Verified" : "⚠ Pending"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewDoc({ name: doc.name, url: doc.name.toLowerCase().includes('permis') ? 'https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop' })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0da08b]/10 text-[#0da08b] text-[10px] font-black uppercase tracking-widest hover:bg-[#0da08b]/20 transition-colors">
                    <Eye className="size-3" /> Visualiser
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDocModal(false)}
                className="w-full h-12 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actual Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setPreviewDoc(null)} />
           <div className="relative w-full max-w-3xl flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="w-full flex items-center justify-between mb-4">
                 <h3 className="text-white font-black uppercase tracking-widest text-xl">{previewDoc.name}</h3>
                 <button onClick={() => setPreviewDoc(null)} className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all">
                    <X className="size-5" />
                 </button>
              </div>
              <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl p-4">
                 <div className="bg-slate-100 rounded-2xl w-full h-[60vh] flex items-center justify-center overflow-hidden relative">
                    <img src={previewDoc.url} className="w-full h-full object-cover opacity-90 mix-blend-multiply" alt="Document Preview" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
