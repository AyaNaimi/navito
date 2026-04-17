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
    title: "Night Under the Stars â€“ Merzouga",
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

  if (selected) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Activities
        </button>
      </div>
    );
  }

  const FormModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowForm(false)} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b]/10 text-[#0da08b]">
              {editMode ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showForm && <FormModal />}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Activity Management</h2>
          <div className="flex items-center gap-2 mt-1">
            <Globe className="size-4 text-[#0da08b]" />
            <p className="text-sm font-medium text-slate-400">
              Manage your global travel packs â€” {activities.length} activities.
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
          <div className="py-16 text-center space-y-3">
            <Globe className="size-10 text-slate-200 mx-auto" />
            <p className="text-slate-400 font-bold text-sm">No activities found.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
