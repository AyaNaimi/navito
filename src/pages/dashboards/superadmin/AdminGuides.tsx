import { useState } from "react";
import {
  Compass,
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
  Languages,
  Trophy,
  History,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

type Guide = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
  status: "verified" | "pending";
  joined: string;
  languages: string[];
  avatar: string;
  documents: { name: string; verified: boolean }[];
};

type PendingGuide = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  languages: string[];
  submittedAt: string;
  avatar: string;
  documents: { name: string; submitted: boolean }[];
};

const initialGuides: Guide[] = [
  {
    id: "G-001",
    name: "Amina Benkirane",
    email: "amina.b@mta.ma",
    phone: "+212 661 001 122",
    city: "Fès",
    rating: 4.9,
    status: "verified",
    joined: "10 Nov 2023",
    languages: ["Fr", "Ar", "En"],
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amina",
    documents: [
      { name: "National ID", verified: true },
      { name: "Guide Certification", verified: true },
      { name: "First Aid Certificate", verified: true },
    ],
  },
  {
    id: "G-002",
    name: "Salma Idrissi",
    email: "salma.i@mta.ma",
    phone: "+212 661 334 455",
    city: "Chefchaouen",
    rating: 5.0,
    status: "verified",
    joined: "05 Jan 2024",
    languages: ["Fr", "Ar", "Es"],
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Salma",
    documents: [
      { name: "National ID", verified: true },
      { name: "Guide Certification", verified: true },
      { name: "First Aid Certificate", verified: false },
    ],
  },
  {
    id: "G-004",
    name: "Yassine Tazi",
    email: "yassine.t@mta.ma",
    phone: "+212 661 556 677",
    city: "Marrakech",
    rating: 4.7,
    status: "verified",
    joined: "15 Feb 2024",
    languages: ["Fr", "Ar", "En"],
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Yassine",
    documents: [
      { name: "National ID", verified: true },
      { name: "Guide Certification", verified: true },
      { name: "First Aid Certificate", verified: true },
    ],
  },
];

const initialPending: PendingGuide[] = [
  {
    id: "P-G-001",
    name: "Hicham El Mansouri",
    email: "hicham.e@mta.ma",
    phone: "+212 660 778 899",
    city: "Merzouga",
    languages: ["Ar", "En", "Ber"],
    submittedAt: "Today, 10:30 AM",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Hicham",
    documents: [
      { name: "National ID", submitted: true },
      { name: "Guide Certification", submitted: true },
      { name: "First Aid Certificate", submitted: false },
    ],
  },
  {
    id: "P-G-002",
    name: "Nadia Chahid",
    email: "nadia.c@mta.ma",
    phone: "+212 660 112 233",
    city: "Ouarzazate",
    languages: ["Fr", "Ar", "En"],
    submittedAt: "Yesterday, 02:45 PM",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nadia",
    documents: [
      { name: "National ID", submitted: true },
      { name: "Guide Certification", submitted: true },
      { name: "First Aid Certificate", submitted: true },
    ],
  },
];

const langLabel = (code: string) => {
  const map: Record<string, string> = {
    Fr: "French",
    Ar: "Arabic",
    En: "English",
    Es: "Spanish",
    Ber: "Amazigh",
  };
  return map[code] ?? code;
};

export default function AdminGuides({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [pending, setPending] = useState<PendingGuide[]>(initialPending);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDocGuide, setViewDocGuide] = useState<PendingGuide | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{name: string; url: string} | null>(null);

  const filtered = guides
    .filter((g) => g.status === "verified")
    .filter(
      (g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleConfirm = (p: PendingGuide) => {
    const newGuide: Guide = {
      id: "G-" + String(guides.length + 1).padStart(3, "0"),
      name: p.name,
      email: p.email,
      phone: p.phone,
      city: p.city,
      rating: 5.0,
      status: "verified",
      joined: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      languages: p.languages,
      avatar: p.avatar,
      documents: p.documents.map((d) => ({ name: d.name, verified: d.submitted })),
    };
    setGuides((prev) => [...prev, newGuide]);
    setPending((prev) => prev.filter((x) => x.id !== p.id));
  };

  const handleReject = (id: string) => {
    setPending((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Guide Management</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Supervise and certify your network of local experts.
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
                        <Compass className="size-3 text-[#0da08b]" />
                        <span className="text-[11px] font-bold text-slate-500">{p.languages.join(", ")}</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <p className="text-[10px] font-bold text-slate-400 text-right">Submitted</p>
                      <p className="text-[10px] font-black text-slate-600 text-right">{p.submittedAt}</p>
                    </div>
                  </div>

                  {/* Document status */}
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

                  {/* Action buttons */}
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
                      onClick={() => { setViewDocGuide(p); setShowDocModal(true); }}
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

      {/* Verified Guides Table */}
      <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-[#0da08b]" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Certified Guides</span>
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
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-10">Guide</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rating</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Languages</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm font-bold">
                      No certified guides found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((g) => (
                    <tr
                      key={g.id}
                      onClick={() => setSelectedGuide(g)}
                      className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="p-6 pl-10">
                        <div className="flex items-center gap-4">
                          <img
                            src={g.avatar}
                            className="size-10 rounded-xl bg-slate-100 border border-slate-200 group-hover:border-[#0da08b]/40 transition-colors"
                            alt={g.name}
                          />
                          <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-[#0da08b] transition-colors uppercase tracking-tight">
                              {g.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">{g.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-[#0da08b]" /> {g.city}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-xs font-black text-[#0da08b]">
                          <Star className="size-3 fill-[#0da08b]" /> {g.rating}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-1 flex-wrap">
                          {g.languages.map((l) => (
                            <span
                              key={l}
                              className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase"
                            >
                              {l}
                            </span>
                          ))}
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

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedGuide(null)}
          />
          <div className="relative w-full max-w-4xl rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              {/* Sidebar */}
              <div className="md:col-span-2 bg-[#0da08b] p-10 flex flex-col items-center justify-center text-center text-white relative">
                <img
                  src={selectedGuide.avatar}
                  className="size-40 rounded-[2.5rem] border-8 border-white/20 shadow-2xl bg-white mb-6"
                  alt="Avatar"
                />
                <h3 className="text-2xl font-black uppercase tracking-widest">{selectedGuide.name}</h3>
                <div className="mt-4 flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <MapPin className="size-4" />
                  <span className="text-sm font-bold">{selectedGuide.city}, Morocco</span>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-10 bg-white space-y-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-bold text-slate-900">{selectedGuide.joined}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-5 rounded-[1.5rem] bg-slate-50 text-center space-y-2 border border-slate-100 hover:bg-teal-50 hover:border-teal-100 transition-all group">
                    <Trophy className="size-5 text-[#0da08b] mx-auto opacity-50 group-hover:opacity-100" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0da08b]">Rank</p>
                    <p className="text-base font-black text-slate-900">Expert</p>
                  </div>
                  <div className="p-5 rounded-[1.5rem] bg-slate-50 text-center space-y-2 border border-slate-100 hover:bg-teal-50 hover:border-teal-100 transition-all group">
                    <Star className="size-5 text-[#0da08b] mx-auto opacity-50 group-hover:opacity-100" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0da08b]">Rating</p>
                    <p className="text-base font-black text-slate-900">{selectedGuide.rating}</p>
                  </div>
                  <div className="p-5 rounded-[1.5rem] bg-slate-50 text-center space-y-2 border border-slate-100 hover:bg-teal-50 hover:border-teal-100 transition-all group">
                    <History className="size-5 text-[#0da08b] mx-auto opacity-50 group-hover:opacity-100" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0da08b]">Tours</p>
                    <p className="text-base font-black text-slate-900">124+</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
                    Languages & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.languages.map((l) => (
                      <span
                        key={l}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600"
                      >
                        <Languages className="size-3.5 text-[#0da08b]" /> {langLabel(l)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next events */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
                    Upcoming Events
                  </h4>
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-[#0da08b]/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0da08b]">
                        <Calendar className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Medina Walking Tour</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tomorrow at 09:00</p>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-200 group-hover:text-[#0da08b] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Documents preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
                    Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedGuide.documents.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        {doc.verified ? (
                          <CheckCircle2 className="size-3.5 text-[#0da08b]" />
                        ) : (
                          <AlertCircle className="size-3.5 text-orange-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => { setSelectedGuide(null); onNavigate("messages"); }}
                    className="flex-1 h-12 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => {
                      setViewDocGuide(null);
                      setShowDocModal(true);
                    }}
                    className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
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

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b]/10 text-[#0da08b]">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {viewDocGuide ? viewDocGuide.name : selectedGuide?.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Document Dossier</p>
              </div>
            </div>

            <div className="space-y-3">
              {(
                viewDocGuide
                  ? viewDocGuide.documents.map((d) => ({ name: d.name, verified: d.submitted }))
                  : selectedGuide?.documents ?? []
              ).map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#0da08b]/30 transition-colors"
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
                  <button onClick={() => setPreviewDoc({ name: doc.name, url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop' })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0da08b]/10 text-[#0da08b] text-[10px] font-black uppercase tracking-widest hover:bg-[#0da08b]/20 transition-colors">
                    <Eye className="size-3" /> Visualiser
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDocModal(false)}
              className="w-full h-12 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Close
            </button>
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
