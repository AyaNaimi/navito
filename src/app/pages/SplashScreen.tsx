import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="size-full bg-[#0D9488] flex flex-col items-center justify-center">
      <div className="animate-enter-hero">
        <h1 className="mb-4 text-7xl font-serif text-white">Navito</h1>
        <p className="text-center text-sm uppercase tracking-widest text-white/80">
          Travel Assistant
        </p>
      </div>
    </div>
  );
}
