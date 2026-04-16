import { useEffect, useMemo, useState } from "react";
import { Clock3, Loader2, MapPin, Search, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { useAppContext } from "../../../app/context/AppContext";
import { fetchActivities, fetchCities, type ApiActivity, type ApiCity } from "../../../app/services/api";

function formatPrice(activity: ApiActivity) {
  if (activity.price_min != null && activity.price_max != null) {
    return `${activity.price_min}-${activity.price_max} MAD`;
  }

  if (activity.price_min != null) {
    return `A partir de ${activity.price_min} MAD`;
  }

  if (activity.price_max != null) {
    return `Jusqu'a ${activity.price_max} MAD`;
  }

  return "Prix non renseigne";
}

export default function GuideTours({ onNavigate: _onNavigate }: { onNavigate?: (id: string) => void }) {
  const { city } = useAppContext();
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [activitiesResponse, citiesResponse] = await Promise.all([
          fetchActivities(),
          fetchCities(),
        ]);
        setActivities(activitiesResponse.data ?? []);
        setCities(citiesResponse.data ?? []);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const activeCity = useMemo(
    () => cities.find((item) => item.name.toLowerCase() === city.toLowerCase()),
    [cities, city],
  );

  const visibleActivities = useMemo(() => {
    const term = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesCity = activeCity ? activity.city_id === activeCity.id : true;
      const matchesSearch = term === ""
        || [activity.name, activity.description ?? "", activity.city?.name ?? ""].some((value) =>
          value.toLowerCase().includes(term),
        );

      return matchesCity && matchesSearch;
    });
  }, [activities, activeCity, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <Card className="rounded-[36px] border-0 bg-slate-900 text-white shadow-[0_24px_60px_-20px_rgba(0,137,123,0.35)]">
        <CardContent className="space-y-4 p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#49d3c6]">Activites Guide</p>
          <h2 className="text-3xl font-black tracking-tight">
            {city ? `Activites visibles a ${city}` : "Activites disponibles pour les guides"}
          </h2>
          <p className="max-w-2xl text-sm font-medium leading-6 text-slate-300">
            Cette section affiche les activites publiees depuis le CRUD admin, pour que les guides voient les offres reelles proposees aux touristes.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une activite ou une ville..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#49d3c6]"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#00897B]" />
        </div>
      ) : visibleActivities.length === 0 ? (
        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardContent className="p-10 text-center">
            <p className="text-xl font-black text-slate-900">Aucune activite disponible</p>
            <p className="mt-2 text-sm text-slate-500">
              Ajoutez des activites depuis l espace admin pour les voir apparaitre ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {visibleActivities.map((activity) => (
            <Card key={activity.id} className="rounded-[30px] border-0 bg-white shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900">{activity.name}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4 text-[#00897B]" />
                        {activity.city?.name ?? "Ville inconnue"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-4 text-[#00897B]" />
                        {activity.duration_label || "Duree libre"}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                    <Star className="size-3.5 fill-current" />
                    {activity.rating ?? "N/A"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  {activity.description || "Aucune description fournie pour cette activite."}
                </p>
                <div className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Tarif</p>
                    <p className="mt-1 text-base font-black text-slate-900">{formatPrice(activity)}</p>
                  </div>
                  <a
                    href={`/activity/${activity.id}`}
                    className="rounded-2xl bg-[#00897B] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white"
                  >
                    Voir fiche
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
