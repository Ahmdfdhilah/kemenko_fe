// Header.tsx
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { WaveBackground } from '@/components/common/WaveBackground';

const Header = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg lg:flex-1 relative lg:basis-2/3 py-6 px-2">
        {/* Wave Pattern Background */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <WaveBackground />
        </div>

        <div className="mx-auto p-4 sm:p-6 relative z-10">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex justify-start">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary/20 shrink-0">
                <AvatarFallback className="bg-popover text-primary font-semibold text-sm sm:text-base">
                  AF
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-lg sm:text-xl lg:text-2xl text-popover leading-relaxed">
                Selamat datang,
              </p>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-popover leading-tight break-words">
                Ahmad Fadillah
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;