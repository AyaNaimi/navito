import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
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

  return (
    <div className="size-full bg-white/70 backdrop-blur-sm p-6">
      <div className="mx-auto max-w-xl">
        <Card className="overflow-hidden rounded-3xl border-white/30 bg-white/50 shadow-lg backdrop-blur-md">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle>Verify Identity</CardTitle>
            <p className="text-sm text-slate-500">Upload license and insurance to continue your onboarding.</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Driver License</label>
              <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onChangeDoc('license')} />
              {documents.license ? <p className="text-xs text-emerald-600">Uploaded: {documents.license.name}</p> : null}
              {errors.license ? <p className="text-xs text-red-500">{errors.license}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance</label>
              <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onChangeDoc('insurance')} />
              {documents.insurance ? <p className="text-xs text-emerald-600">Uploaded: {documents.insurance.name}</p> : null}
              {errors.insurance ? <p className="text-xs text-red-500">{errors.insurance}</p> : null}
            </div>
            <Button onClick={handleSubmit} className="mt-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700">
              Submit for Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
