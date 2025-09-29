// Header.tsx
import { WaveBackground } from '@/components/common/WaveBackground';
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg text-primary-foreground lg:flex-1 relative lg:basis-2/3 py-6 px-2">
        {/* Wave Pattern Background */}
        <div className="absolute inset-0 overflow-hidden">
          <WaveBackground />
        </div>

        <div className="mx-auto p-4 sm:p-6 relative z-10">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-1">
              <p className="text-xl sm:text-2xl lg:text-4xl text-popover leading-relaxed">
                Selamat datang,
              </p>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-popover leading-tight break-words">
                {user?.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;