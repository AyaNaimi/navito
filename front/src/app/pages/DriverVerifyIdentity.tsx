import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileBadge2, ShieldCheck, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAppContext } from '../context/AppContext';

export default function DriverVerifyIdentity() {
  const navigate = useNavigate();
  const { authMode, driverVerificationStatus, submitDriverDocuments } = useAppContext();
  const [documents, setDocuments] = useState<{ license: File | null; insurance: File | null }>({
    license: null,
    insurance: null,
  });
  const [errors, setErrors] = useState<{ license?: string; insurance?: string }>({});

  useEffect(() => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/driver/join', { replace: true });
      return;
    }
    if (driverVerificationStatus === 'none') {
      navigate('/driver/join', { replace: true });
    }
  }, [authMode, driverVerificationStatus, navigate]);

  const validateFile = (file: File | null): string | undefined => {
    if (!file) return 'This document is required';
    const acceptedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!acceptedTypes.includes(file.type)) return 'Only PDF, PNG, JPG are allowed';
    if (file.size > 5 * 1024 * 1024) return 'Max file size is 5MB';
    return undefined;
  };

  const onChangeDoc = (field: 'license' | 'insurance') => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setDocuments((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: validateFile(file) }));
  };

  const handleSubmit = () => {
    const licenseError = validateFile(documents.license);
    const insuranceError = validateFile(documents.insurance);
    setErrors({ license: licenseError, insurance: insuranceError });
    if (licenseError || insuranceError) return;

    submitDriverDocuments();
    navigate('/driver/pending');
  };

  const uploads = [
    {
      key: 'license' as const,
      title: 'Driver license',
      hint: 'PDF, PNG or JPG accepted',
      file: documents.license,
      error: errors.license,
    },
    {
      key: 'insurance' as const,
      title: 'Insurance',
      hint: 'Professional insurance document',
      file: documents.insurance,
      error: errors.insurance,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background p-6 text-foreground transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] right-0 h-[34%] w-[44%] rounded-full bg-accent/10 blur-[130px]" />
        <div className="absolute bottom-[8%] left-0 h-[40%] w-[45%] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden rounded-[2.8rem] border border-border bg-card shadow-2xl">
            <CardHeader className="space-y-5 p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-foreground text-background shadow-2xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Verification</p>
                <CardTitle className="mt-2 text-2xl font-black uppercase tracking-tight italic">Verify identity</CardTitle>
                <p className="mt-3 text-[13px] font-medium leading-relaxed text-muted-foreground">
                  Upload the required documents to continue the onboarding flow with the same theme as the newer screens.
                </p>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 p-7 pt-0">
              {uploads.map((item) => (
                <div key={item.key} className="rounded-[2rem] border border-border bg-secondary/60 p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-black uppercase tracking-tight">{item.title}</p>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{item.hint}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-accent">
                      <FileBadge2 className="h-5 w-5" />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.4rem] border border-dashed border-border bg-card px-4 py-5 transition-all hover:border-accent/40 hover:bg-background">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      {item.file ? item.file.name : 'Choose file'}
                    </span>
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={onChangeDoc(item.key)}
                      className="hidden"
                    />
                  </label>

                  {item.file ? <p className="mt-3 text-xs font-medium text-emerald-600">Uploaded: {item.file.name}</p> : null}
                  {item.error ? <p className="mt-3 text-xs font-medium text-destructive">{item.error}</p> : null}
                </div>
              ))}

              <Button
                onClick={handleSubmit}
                className="mt-2 h-14 rounded-[1.6rem] bg-foreground text-background hover:bg-accent hover:text-white font-black uppercase tracking-[0.18em] shadow-2xl shadow-foreground/10"
              >
                Submit for verification
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
