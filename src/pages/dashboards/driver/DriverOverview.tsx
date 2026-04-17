import { CalendarDays, CarFront, CheckCircle2, FileCheck2, MapPin, MessageSquare, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { useAppContext } from "../../../app/context/AppContext";
import { updateDriverRequest, type DriverDashboardData } from "../../../app/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const verificationLabels: Record<string, string> = {
  none: "Profil incomplet",
  documents_pending: "Documents a envoyer",
  pending: "Verification en cours",
  verified: "Compte verifie",
  rejected: "Verification refusee",
};

const verificationStyles: Record<string, string> = {
  none: "bg-slate-100 text-slate-700",
  documents_pending: "bg-amber-100 text-amber-800",
  pending: "bg-blue-100 text-blue-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function DriverOverview({ dashboardData }: { dashboardData: DriverDashboardData | null }) {
  const navigate = useNavigate();
  const { city, userName, authToken } = useAppContext();
  const profile = dashboardData?.profile;
  const verificationStatus = dashboardData?.verification_status ?? "none";
  const requests = dashboardData?.requests ?? [];
  const pendingRequests = requests.filter((request) => request.status === "pending");
  const completedRequests = requests.filter((request) => request.status === "completed");

  const handleAccept = async (requestId: number) => {
    if (!authToken) {
      return;
    }

    try {
      await updateDriverRequest(requestId, { status: "accepted" }, authToken);
      toast.success("Demande acceptee.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'accepter la demande.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <Card className="rounded-[32px] border-0 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00897B]">Compte Chauffeur</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Bonjour, {userName}</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
              Cette vue affiche maintenant uniquement les informations reelles renvoyees par l'API chauffeur.
            </p>
          </div>
          <div className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${verificationStyles[verificationStatus] ?? verificationStyles.none}`}>
            <ShieldCheck className="mr-2 size-4" />
            {verificationLabels[verificationStatus] ?? verificationLabels.none}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <UserRound className="size-4 text-[#00897B]" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nom</p>
              <p className="mt-1 font-bold text-slate-900">{userName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ville</p>
              <p className="mt-1 font-bold text-slate-900">{profile?.city?.name ?? city ?? "Non renseignee"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <CalendarDays className="size-4 text-[#00897B]" />
              Demandes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">En attente</p>
              <p className="mt-1 font-bold text-slate-900">{pendingRequests.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Terminees</p>
              <p className="mt-1 font-bold text-slate-900">{completedRequests.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-900">
              <CarFront className="size-4 text-[#00897B]" />
              Vehicule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</p>
              <p className="mt-1 font-bold text-slate-900">{profile?.vehicle_type ?? "Non renseigne"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Telephone</p>
              <p className="mt-1 font-bold text-slate-900">{profile?.phone ?? "Non renseigne"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[32px] border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
            <FileCheck2 className="size-5 text-[#00897B]" />
            Etat du raccordement
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authentification</p>
            <p className="mt-2 font-bold text-slate-900">Reliee a Laravel Sanctum</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Profil chauffeur</p>
            <p className="mt-2 font-bold text-slate-900">{profile ? "Charge depuis /api/me/dashboard" : "Aucune donnee chargee"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Demandes chauffeur</p>
            <p className="mt-2 font-bold text-slate-900">{requests.length} demande(s) chargee(s)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900">Demandes chauffeur reelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Aucune demande n'a encore ete recue pour ce chauffeur.
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-900">{request.tourist?.name ?? "Touriste inconnu"}</p>
                    <p className="text-sm font-medium text-slate-500">{request.tourist?.email ?? "Email indisponible"}</p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4 text-[#00897B]" />
                        {request.pickup_location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CarFront className="size-4 text-[#00897B]" />
                        {request.destination || "Destination non precisee"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#00897B]" />
                        {request.travel_date || "Date non precisee"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Phone className="size-4 text-[#00897B]" />
                        {profile?.phone ?? "Telephone non renseigne"}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{request.notes || "Aucune note ajoutee."}</p>
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
