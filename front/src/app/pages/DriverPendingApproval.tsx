import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileText, Hourglass, LogOut, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useAppContext } from '../context/AppContext';

export default function DriverPendingApproval() {
  const navigate = useNavigate();
  const { authMode, driverVerificationStatus, userName, resetFlow } = useAppContext();

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/driver/login', { replace: true });
      return;
    }
    if (driverVerificationStatus === 'verified') {
      navigate('/dashboard/driver', { replace: true });
    }
  }, [authMode, driverVerificationStatus, navigate]);

  const documents = [
    { name: 'Driver license', status: 'verified' },
    { name: 'National ID', status: 'verified' },
    { name: 'Professional insurance', status: 'verified' },
    { name: 'Vehicle inspection', status: 'pending' },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-background p-6 text-foreground transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background shadow-2xl">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Navito pilot</p>
              <h1 className="text-lg font-black uppercase tracking-tight italic">Verification queue</h1>
            </div>
          </div>

          <button
            onClick={() => {
              resetFlow();
              navigate('/driver/login');
            }}
            className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[3rem] border border-border bg-card p-8 shadow-2xl"
        >
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-amber-600">
                <Hourglass className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Pending review</span>
              </div>
              <h2 className="mt-5 text-2xl font-black uppercase tracking-tight">
                Welcome, {userName.split(' ')[0]}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[13px] font-medium leading-relaxed text-muted-foreground">
                Your documents are in the verification workflow. This page now uses the same card system and theme as the newer screens.
              </p>
            </div>

            <div className="space-y-3">
              <p className="px-1 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Submitted documents</p>
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-[1.8rem] border border-border bg-secondary/50 px-5 py-4 transition-all hover:bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-tight">{doc.name}</span>
                  </div>

                  {doc.status === 'verified' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                      Pending
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/splash')}
              className="h-14 w-full rounded-[1.8rem] bg-foreground text-background hover:bg-accent hover:text-white font-black uppercase tracking-[0.18em] shadow-2xl shadow-foreground/10"
            >
              Return to catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
