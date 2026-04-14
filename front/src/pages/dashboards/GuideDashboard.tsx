import { Search, Bell, ChevronDown, MapPin, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card";

const assignedTours = [
  { id: 1, title: "Marrakech City Walk", location: "Marrakech, Morocco", date: "Oct 12, 2024", duration: "4 hours", status: "Upcoming", image: "https://images.unsplash.com/photo-1597838816882-4435b1977fbe?auto=format&fit=crop&q=80&w=300" },
  { id: 2, title: "Atlas Mountains Hike", location: "Atlas, Morocco", date: "Oct 15, 2024", duration: "8 hours", status: "Confirmed", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=300" },
  { id: 3, title: "Sahara Desert Tour", location: "Merzouga, Morocco", date: "Oct 20, 2024", duration: "3 days", status: "Pending", image: "https://images.unsplash.com/photo-1549424615-54523e5cc2ed?auto=format&fit=crop&q=80&w=300" },
];

const assignedTravelers = [
  { id: 1, name: "Sarah Jenkins", tour: "Marrakech City Walk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=ffedd5" },
  { id: 2, name: "Michael Chen", tour: "Atlas Mountains Hike", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=ffedd5" },
  { id: 3, name: "Emma Thompson", tour: "Sahara Desert Tour", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emma&backgroundColor=ffedd5" },
  { id: 4, name: "David L.", tour: "Marrakech City Walk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=ffedd5" },
];

export default function GuideDashboard() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="sticky top-0 z-30 flex h-[88px] items-center justify-between border-b bg-white/80 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-md">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Guide Dashboard - Tours and Travelers</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tours..."
              className="h-10 w-64 rounded-full bg-slate-100 pl-10 pr-4 text-sm outline-none transition-all focus:bg-slate-200 focus:ring-2 focus:ring-[#F97316]/20"
            />
          </div>
          <button className="relative flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200">
            <Bell className="size-4" />
          </button>
          <div className="flex items-center gap-3 border-l pl-6">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Guide&backgroundColor=ffedd5"
              alt="Guide"
              className="size-10 rounded-full border border-orange-200"
            />
            <div className="hidden flex-col text-left sm:flex">
              <span className="text-sm font-semibold text-slate-900">Youssef</span>
              <span className="text-xs text-slate-500">Local Guide</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Assigned Tours */}
          <Card className="rounded-3xl border-0 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6 pt-6">
              <CardTitle className="text-lg font-bold text-slate-900">Assigned Tours</CardTitle>
              <button className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200">
                Latest
                <ChevronDown className="ml-1 size-4" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {assignedTours.map((tour) => (
                  <div key={tour.id} className="flex items-center gap-4 p-6 transition-colors hover:bg-slate-50">
                    <img src={tour.image} alt={tour.title} className="size-20 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{tour.title}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {tour.location}</span>
                        <span>•</span>
                        <span>{tour.date}</span>
                        <span>•</span>
                        <span>{tour.duration}</span>
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      tour.status === 'Upcoming' ? 'bg-orange-100 text-orange-700' :
                      tour.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {tour.status}
                    </div>
                    <button className="ml-4 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 p-4">
                <span className="text-sm text-slate-500">Showing 3 of 12 tours</span>
                <div className="flex gap-2">
                  <button className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="size-4" /></button>
                  <button className="flex size-8 items-center justify-center rounded-full bg-[#F97316] text-white shadow-sm hover:bg-[#ea580c]"><ChevronRight className="size-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Travelers */}
          <Card className="rounded-3xl border-0 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6 pt-6">
              <CardTitle className="text-lg font-bold text-slate-900">Assigned Travelers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {assignedTravelers.map((traveler) => (
                  <div key={traveler.id} className="flex items-center justify-between p-5 transition-colors hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <img src={traveler.avatar} alt={traveler.name} className="size-10 rounded-full border border-orange-100 bg-orange-50" />
                      <div>
                        <p className="font-semibold text-slate-900">{traveler.name}</p>
                        <p className="text-xs text-slate-500">{traveler.tour}</p>
                      </div>
                    </div>
                    <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[#F97316] transition-colors hover:bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 p-4">
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-[#F97316]" />
                  <div className="size-2 rounded-full bg-slate-200" />
                  <div className="size-2 rounded-full bg-slate-200" />
                </div>
                <button className="text-sm font-medium text-[#F97316] hover:text-[#ea580c]">View All</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
