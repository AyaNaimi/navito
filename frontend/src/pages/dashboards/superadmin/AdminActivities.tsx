import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { useAppContext } from "../../../app/context/AppContext";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  fetchCities,
  updateActivity,
  type ActivityPayload,
  type ApiActivity,
  type ApiCity,
} from "../../../app/services/api";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

type ActivityFormState = {
  city_id: string;
  name: string;
  slug: string;
  description: string;
  duration_label: string;
  price_min: string;
  price_max: string;
  rating: string;
  is_published: boolean;
};

const emptyForm: ActivityFormState = {
  city_id: "",
  name: "",
  slug: "",
  description: "",
  duration_label: "",
  price_min: "",
  price_max: "",
  rating: "",
  is_published: true,
};

function buildSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toFormState(activity: ApiActivity): ActivityFormState {
  return {
    city_id: String(activity.city_id),
    name: activity.name,
    slug: activity.slug,
    description: activity.description ?? "",
    duration_label: activity.duration_label ?? "",
    price_min: activity.price_min != null ? String(activity.price_min) : "",
    price_max: activity.price_max != null ? String(activity.price_max) : "",
    rating: activity.rating != null ? String(activity.rating) : "",
    is_published: activity.is_published,
  };
}

function toPayload(form: ActivityFormState): ActivityPayload {
  return {
    city_id: Number(form.city_id),
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || undefined,
    duration_label: form.duration_label.trim() || undefined,
    price_min: form.price_min.trim() ? Number(form.price_min) : null,
    price_max: form.price_max.trim() ? Number(form.price_max) : null,
    rating: form.rating.trim() ? Number(form.rating) : null,
    is_published: form.is_published,
  };
}

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

  return "Prix libre";
}

export default function AdminActivities({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const { authToken } = useAppContext();
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ApiActivity | null>(null);
  const [form, setForm] = useState<ActivityFormState>(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activitiesResponse, citiesResponse] = await Promise.all([
        fetchActivities(undefined, undefined, false),
        fetchCities(),
      ]);
      setActivities(activitiesResponse.data ?? []);
      setCities(citiesResponse.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de charger les activites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return activities;
    }

    return activities.filter((activity) =>
      [activity.name, activity.slug, activity.city?.name ?? "", activity.description ?? ""]
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [activities, search]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleNameChange = (value: string) => {
    setForm((current) => {
      const nextSlug = current.slug === "" || current.slug === buildSlug(current.name) ? buildSlug(value) : current.slug;
      return { ...current, name: value, slug: nextSlug };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!authToken) {
      toast.error("Connexion administrateur requise.");
      return;
    }

    setSaving(true);

    try {
      const payload = toPayload(form);

      if (editing) {
        await updateActivity(editing.id, payload, authToken);
        toast.success("Activite mise a jour.");
      } else {
        await createActivity(payload, authToken);
        toast.success("Activite ajoutee.");
      }

      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'enregistrer l'activite.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity: ApiActivity) => {
    if (!authToken) {
      toast.error("Connexion administrateur requise.");
      return;
    }

    try {
      await deleteActivity(activity.id, authToken);
      toast.success("Activite supprimee.");
      if (editing?.id === activity.id) {
        resetForm();
      }
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Suppression impossible.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00897B]">CRUD Activites</p>
          <h2 className="mt-1 text-3xl font-black text-slate-900">Gerer les activites reelles</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Les ajouts ici alimentent directement les vues touristes et guides via l API Laravel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            onNavigate("packages");
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#00897B] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white"
        >
          <Plus className="size-4" />
          Nouvelle activite
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] border-0 bg-white shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl font-black text-slate-900">Catalogue des activites</CardTitle>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {filteredActivities.length} resultat(s)
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une activite, une ville, un slug..."
                className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#00897B]"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-7 animate-spin text-[#00897B]" />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-lg font-black text-slate-900">Aucune activite trouvee</p>
                <p className="mt-2 text-sm text-slate-500">Ajoutez une activite ou modifiez votre recherche.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">{activity.name}</h3>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                            activity.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {activity.is_published ? "publiee" : "brouillon"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="size-4 text-[#00897B]" />
                            {activity.city?.name ?? "Ville inconnue"}
                          </span>
                          <span>{activity.duration_label || "Duree non renseignee"}</span>
                          <span>{formatPrice(activity)}</span>
                          <span>Note {activity.rating ?? "N/A"}</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                          {activity.description || "Aucune description pour cette activite."}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                          /activity/{activity.id} • {activity.slug}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(activity);
                            setForm(toFormState(activity));
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700"
                        >
                          <Pencil className="size-4" />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(activity)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-rose-600"
                        >
                          <Trash2 className="size-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-900">
              {editing ? "Modifier l activite" : "Ajouter une activite"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Ville</label>
                <select
                  value={form.city_id}
                  onChange={(event) => setForm((current) => ({ ...current, city_id: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  required
                >
                  <option value="">Choisir une ville</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Nom</label>
                <input
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Slug</label>
                <input
                  value={form.slug}
                  onChange={(event) => setForm((current) => ({ ...current, slug: buildSlug(event.target.value) }))}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00897B]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Duree</label>
                  <input
                    value={form.duration_label}
                    onChange={(event) => setForm((current) => ({ ...current, duration_label: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Note</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Prix min</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price_min}
                    onChange={(event) => setForm((current) => ({ ...current, price_min: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Prix max</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price_max}
                    onChange={(event) => setForm((current) => ({ ...current, price_max: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#00897B]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))}
                />
                Publier immediatement l activite
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#00897B] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white disabled:opacity-70"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  {editing ? "Mettre a jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700"
                >
                  Reinitialiser
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
