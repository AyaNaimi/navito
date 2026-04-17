import { CalendarDays, CheckCircle2, Clock3, Compass, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { useAppContext } from "../../../app/context/AppContext";
import { updateGuideRequest, type GuideDashboardData } from "../../../app/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function formatDate(value?: string | null) {
  if (!value) {
    return "Non precisee";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function GuideOverview({
  onNavigate,
  dashboardData,
}: {
  onNavigate?: (id: string) => void;
  dashboardData: GuideDashboardData | null;
}) {
  const navigate = useNavigate();
  const { userName, authToken } = useAppContext();
  const requests = dashboardData?.requests ?? [];
  const pendingRequests = requests.filter((request) => request.status === "pending");
  const acceptedRequests = requests.filter((request) => request.status === "accepted");
  const completedRequests = requests.filter((request) => request.status === "completed");

  const handleAccept = async (requestId: number) => {
    if (!authToken) {
      return;
    }

    try {
      await updateGuideRequest(requestId, { status: "accepted" }, authToken);
      toast.success("Demande acceptee.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'accepter la demande.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <Card className="rounded-[36px] border-0 bg-slate-900 text-white shadow-[0_24px_60px_-20px_rgba(0,137,123,0.35)]">
        <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#49d3c6]">Dashboard Guide</p>
            <h2 className="text-3xl font-black tracking-tight">Bienvenue, {userName}</h2>
            <p className="max-w-2xl text-sm font-medium leading-6 text-slate-300">
              Cette page est maintenant reliee aux vraies demandes guide renvoyees par le backend Navito.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("tours")}
            className="rounded-2xl bg-[#00897B] px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#00796B]"
          >
            Voir mes visites
          </button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Clock3 className="size-4 text-[#00897B]" />
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{pendingRequests.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Demandes a traiter</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <ShieldCheck className="size-4 text-[#00897B]" />
              Acceptees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{acceptedRequests.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Visites confirmees</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Compass className="size-4 text-[#00897B]" />
              Terminees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{completedRequests.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Historique clos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[32px] border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900">Demandes guide reelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-black text-slate-900">Aucune demande pour ce guide</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Le dashboard est branche, mais aucun touriste ne vous a encore envoye de demande.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Touriste</p>
                      <p className="mt-1 text-lg font-black text-slate-900">{request.tourist?.name ?? "Touriste inconnu"}</p>
                      <p className="text-sm font-medium text-slate-500">{request.tourist?.email ?? "Email indisponible"}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4 text-[#00897B]" />
                        {request.city?.name ?? "Ville non precisee"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#00897B]" />
                        {formatDate(request.travel_date)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {request.notes?.trim() || "Aucune note laissee pour cette demande."}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span className="rounded-full bg-[#00897B]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#00897B]">
                      {request.status}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {request.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => void handleAccept(request.id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-[#00897B] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white"
                        >
                          <CheckCircle2 className="size-4" />
                          Accepter
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => navigate("/messages", { state: { participantId: request.tourist?.id } })}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700"
                      >
                        <MessageSquare className="size-4" />
                        Message
                      </button>
                      {request.tourist?.phone ? (
                        <a
                          href={`tel:${request.tourist.phone}`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700"
                        >
                          <Phone className="size-4" />
                          Appeler
                        </a>
                      ) : null}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      #{request.id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
