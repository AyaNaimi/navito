import { useState } from "react";
import {
  Users,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Search,
  Plus,
  LayoutGrid,
  List,
  Globe,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Tag,
  DollarSign,
  User,
  FileText,
  ArrowLeft,
  Save,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

type Activity = {
  id: number;
  title: string;
  guide: string;
  location: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  members: number;
  maxMembers: number;
  rating: number;
  price: string;
  currency: string;
  duration: string;
  description: string;
  category: string;
  image: string;
};

const seed: Activity[] = [
  {
    id: 1,
    title: "Hot Air Balloon at Sunrise",
    guide: "Ahmed Idrissi",
    location: "Marrakech, Morocco",
    date: "2026-05-12",
    status: "Confirmed",
    members: 8,
    maxMembers: 12,
    rating: 4.9,
    price: "2500",
    currency: "MAD",
    duration: "3 hours",
    category: "Adventure",
    description: "Experience the magic of Marrakech from above aboard a luxury hot air balloon at sunrise. Breathtaking views over the Atlas Mountains and the Medina.",
    image: "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "3-Day Trek in the High Atlas",
    guide: "Karim Atlas",
    location: "Imlil, Morocco",
    date: "2026-05-15",
    status: "Pending",
    members: 12,
    maxMembers: 15,
    rating: 5.0,
    price: "1800",
    currency: "MAD",
    duration: "3 days",
    category: "Trekking",
    description: "A guided 3-day trekking adventure through the High Atlas Mountains. Summit Toubkal, North Africa's highest peak, with an expert local guide.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Night Under the Stars – Merzouga",
    guide: "Youssef Sahara",
    location: "Erg Chebbi, Morocco",
    date: "2026-05-10",
    status: "Confirmed",
    members: 6,
    maxMembers: 10,
    rating: 4.8,
    price: "2100",
    currency: "MAD",
    duration: "1 night",
    category: "Nature",
    description: "Camp in a luxury desert tent deep in the Sahara. Enjoy camel rides at sunset, traditional Berber music around a bonfire, and a sky full of stars.",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Private Eiffel Tower Tour",
    guide: "Jean-Pierre Moreau",
    location: "Paris, France",
    date: "2026-06-20",
    status: "Confirmed",
    members: 4,
    maxMembers: 8,
    rating: 4.9,
    price: "150",
    currency: "EUR",
    duration: "2 hours",
    category: "Cultural",
    description: "Skip-the-line private access to Eiffel Tower with a certified Parisian guide. Includes champagne at the top.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Neon Lights & Shibuya Crossing",
    guide: "Yuki Tanaka",
    location: "Tokyo, Japan",
    date: "2026-06-25",
    status: "Confirmed",
    members: 5,
    maxMembers: 10,
    rating: 5.0,
    price: "12000",
    currency: "JPY",
    duration: "4 hours",
    category: "City Tour",
    description: "An immersive night tour of Tokyo's most iconic spots. From Shibuya crossing to Shinjuku's neon alleys, experience the electric pulse of Toky.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Central Park Cycling Tour",
    guide: "Michael Johnson",
    location: "New York, USA",
    date: "2026-07-05",
    status: "Confirmed",
    members: 10,
    maxMembers: 20,
    rating: 4.7,
    price: "85",
    currency: "USD",
    duration: "2.5 hours",
    category: "Outdoor",
    description: "Explore Central Park's hidden gems by bike with a local New Yorker. Covers iconic landmarks, secret gardens, and the best Instagram spots.",
    image: "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&q=80&w=800",
  },
];

const CATEGORIES = ["Adventure", "Trekking", "Nature", "Cultural", "City Tour", "Outdoor", "Gastronomy", "Wellness"];
const CURRENCIES = ["MAD", "EUR", "USD", "GBP", "JPY"];
const STATUSES: Activity["status"][] = ["Confirmed", "Pending", "Cancelled"];

const statusStyle = (s: Activity["status"]) => {
  if (s === "Confirmed") return "bg-teal-50 text-[#0da08b] border-teal-100";
  if (s === "Pending") return "bg-orange-50 text-orange-500 border-orange-100";
  return "bg-red-50 text-red-400 border-red-100";
};

const statusIcon = (s: Activity["status"]) => {
  if (s === "Confirmed") return <CheckCircle2 className="size-3" />;
  if (s === "Pending") return <AlertCircle className="size-3" />;
  return <X className="size-3" />;
};

type FormData = {
  title: string;
  guide: string;
  location: string;
  date: string;
  status: Activity["status"];
  maxMembers: string;
  price: string;
  currency: string;
  duration: string;
  category: string;
  description: string;
  image: string;
};

const emptyForm: FormData = {
  title: "",
  guide: "",
  location: "",
  date: "",
  status: "Pending",
  maxMembers: "10",
  price: "",
  currency: "MAD",
  duration: "",
  category: "Adventure",
  description: "",
  image: "",
};

export default function AdminActivities({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [activities, setActivities] = useState<Activity[]>(seed);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setShowForm(true);
  };

  const openEdit = (a: Activity) => {
    setForm({
      title: a.title,
      guide: a.guide,
      location: a.location,
      date: a.date,
      status: a.status,
      maxMembers: String(a.maxMembers),
      price: a.price,
      currency: a.currency,
      duration: a.duration,
      category: a.category,
      description: a.description,
      image: a.image,
    });
    setEditMode(true);
    setSelected(null);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.guide.trim() || !form.price.trim()) return;

    if (editMode && selected) {
      const updated: Activity = {
        ...selected,
        ...form,
        maxMembers: parseInt(form.maxMembers) || 10,
      };
      setActivities((prev) => prev.map((a) => (a.id === selected.id ? updated : a)));
      setSelected(updated);
    } else {
      const newAct: Activity = {
        id: Date.now(),
        ...form,
        members: 0,
        maxMembers: parseInt(form.maxMembers) || 10,
        rating: 5.0,
        image:
          form.image ||
          `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800`,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setSelected(null);
    setDeleteConfirm(null);
  };

  const setField = (k: keyof FormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // ── Detail View ─────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Back */}
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Activities
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left – Image */}
          <div className="lg:col-span-2 relative rounded-[2.5rem] overflow-hidden shadow-xl min-h-[320px]">
            <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  statusStyle(selected.status)
                )}
              >
                {statusIcon(selected.status)} {selected.status}
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mt-3">
                {selected.title}
              </h2>
              <p className="text-sm font-bold text-white/70 mt-1">{selected.location}</p>
            </div>
          </div>

          {/* Right – Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => openEdit(selected)}
                className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] active:scale-95 transition-all"
              >
                <Edit3 className="size-4" /> Edit Activity
              </button>
              <button
                onClick={() => setDeleteConfirm(selected.id)}
                className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Participants", value: `${selected.members} / ${selected.maxMembers}`, icon: Users },
                { label: "Price", value: `${selected.price} ${selected.currency}`, icon: DollarSign },
                { label: "Duration", value: selected.duration, icon: Clock },
                { label: "Rating", value: selected.rating.toFixed(1), icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl bg-white border border-slate-100 text-center space-y-1 hover:border-[#0da08b]/30 transition-colors"
                >
                  <Icon className="size-4 text-[#0da08b] mx-auto opacity-70" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="text-sm font-black text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Details card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">
                Activity Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guide</p>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <User className="size-4 text-[#0da08b]" /> {selected.guide}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Calendar className="size-4 text-[#0da08b]" />
                    {new Date(selected.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="size-4 text-[#0da08b]" /> {selected.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Tag className="size-4 text-[#0da08b]" /> {selected.category}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{selected.description}</p>
              </div>
            </div>

            {/* Participants progress */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Participants</p>
                <span className="text-sm font-black text-slate-900">
                  {selected.members} <span className="text-slate-400 font-bold">/ {selected.maxMembers}</span>
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0da08b] transition-all duration-700"
                  style={{ width: `${(selected.members / selected.maxMembers) * 100}%` }}
                />
              </div>
              <p className="text-xs font-bold text-slate-400">
                {selected.maxMembers - selected.members} slots remaining
              </p>
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-5">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-red-50 text-red-500 mx-auto">
                <Trash2 className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Delete Activity?</h3>
                <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-12 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Add / Edit Form Modal ────────────────────────────────────────────────────
  const FormModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowForm(false)} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[95vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b]/10 text-[#0da08b]">
              {editMode ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {editMode ? "Edit Activity" : "New Activity"}
              </h3>
              <p className="text-[11px] font-bold text-slate-400">
                {editMode ? "Update the activity details below." : "Fill in the details to create a new activity pack."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form body */}
        <div className="overflow-y-auto p-8 space-y-6 flex-1">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Sunrise Trekking in the Atlas"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
            />
          </div>

          {/* Guide + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Guide Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={form.guide}
                  onChange={(e) => setField("guide", e.target.value)}
                  placeholder="Guide full name"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="City, Country"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Date + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setField("duration", e.target.value)}
                  placeholder="e.g. 3 hours, 2 days"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Price + Currency + Max Members */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  placeholder="0"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setField("currency", e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 cursor-pointer"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Members</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="number"
                  value={form.maxMembers}
                  onChange={(e) => setField("maxMembers", e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 cursor-pointer"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value as Activity["status"])}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe the activity, what participants will experience..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cover Image URL</label>
            <div className="relative">
              <Camera className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="url"
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
                placeholder="https://example.com/image.jpg (leave blank for default)"
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium outline-none focus:ring-4 focus:ring-[#0da08b]/10 focus:border-[#0da08b]/30 transition-all"
              />
            </div>
            {form.image && (
              <img src={form.image} className="w-full h-32 object-cover rounded-2xl mt-2 border border-slate-100" />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-slate-50 flex gap-4 shrink-0">
          <button
            onClick={() => setShowForm(false)}
            className="flex-1 h-12 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim() || !form.guide.trim() || !form.price.trim()}
            className="flex-1 h-12 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="size-4" />
            {editMode ? "Save Changes" : "Create Activity"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Main List View ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showForm && <FormModal />}

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Activity Management</h2>
          <div className="flex items-center gap-2 mt-1">
            <Globe className="size-4 text-[#0da08b]" />
            <p className="text-sm font-medium text-slate-400">
              Manage your global travel packs — {activities.length} activities.
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex h-12 items-center gap-2 rounded-2xl bg-[#0da08b] px-6 text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all active:scale-95"
        >
          <Plus className="size-4" /> Add Activity
        </button>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Activities", value: activities.length, color: "text-slate-900" },
          { label: "Confirmed", value: activities.filter((a) => a.status === "Confirmed").length, color: "text-[#0da08b]" },
          { label: "Pending", value: activities.filter((a) => a.status === "Pending").length, color: "text-orange-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={cn("text-2xl font-black", color)}>{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-0 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => setView("grid")}
              className={cn("flex size-10 items-center justify-center rounded-xl transition-all", view === "grid" ? "bg-white text-[#0da08b] shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <LayoutGrid className="size-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("flex size-10 items-center justify-center rounded-xl transition-all", view === "list" ? "bg-white text-[#0da08b] shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <List className="size-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Globe className="size-10 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-bold text-sm">No activities found.</p>
              <button onClick={openAdd} className="text-[#0da08b] text-xs font-black uppercase tracking-widest hover:underline">
                + Add your first activity
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelected(act)}
                  className="group relative rounded-[2.5rem] border border-slate-100 bg-white p-4 transition-all hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-5">
                    <img src={act.image} alt={act.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1", statusStyle(act.status))}>
                        {statusIcon(act.status)} {act.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center justify-center border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                        {act.guide}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-[#0da08b] uppercase tracking-widest truncate">{act.location}</p>
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-black text-slate-900">{act.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-[#0da08b] transition-colors line-clamp-2">
                      {act.title}
                    </h4>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{act.members}/{act.maxMembers}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{act.price} {act.currency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelected(act)}
                  className="flex items-center gap-5 p-4 rounded-3xl border border-slate-50 bg-white hover:bg-slate-50 hover:border-[#0da08b]/20 transition-all group cursor-pointer"
                >
                  <img src={act.image} className="size-20 rounded-[1.5rem] object-cover shrink-0" alt={act.title} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", statusStyle(act.status))}>
                        {statusIcon(act.status)} {act.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{act.category}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tighter group-hover:text-[#0da08b] transition-colors">
                      {act.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs font-bold"><MapPin className="size-3.5 text-[#0da08b]" /> {act.location}</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold"><Clock className="size-3.5 text-[#0da08b]" /> {act.duration}</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold"><Users className="size-3.5 text-slate-400" /> {act.members}/{act.maxMembers}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-10 px-4 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guide</p>
                      <p className="text-sm font-bold text-slate-900">{act.guide}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                      <p className="text-sm font-black text-[#0da08b]">{act.price} {act.currency}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-200 group-hover:text-[#0da08b] group-hover:translate-x-1 transition-all mr-2 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
