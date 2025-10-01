import { Phone, Mail } from 'lucide-react';
import footerImage from '@/assets/footer.png';
import logo from '@/assets/logo.webp';

export default function Footer() {
    // Hardcoded data
    const companyInfo = {
        logo: logo,
        name: 'Kementerian Koordinator Bidang Pangan Republik Indonesia',
        offices: [
            {
                name: 'Kantor Pusat',
                address: 'Graha Mandiri, Jl. Imam Bonjol, No. 61, Menteng, Kec. Menteng, Jakarta Pusat, Jakarta, 10310'
            }
        ]
    };

    const contactData = {
        address: 'Graha Mandiri, Jl. Imam Bonjol, No. 61, Menteng, Kec. Menteng, Jakarta Pusat, Jakarta, 10310',
        email: 'humas@kemenkopangan.go.id',
        phone: '(021) 319 36802'
    };

    const copyrightText = '© 2025 Kementerian Koordinator Bidang Pangan. All rights reserved.';

    return (
        <footer
            className="relative text-white overflow-hidden"
            style={{
                backgroundImage: `url(${footerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>

            <div className="relative z-10 mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-8">
                {/* Main company info */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Company Info - More prominent */}
                        <div className="max-w-xl">
                            <div className="flex gap-4">
                                <img
                                    src={companyInfo.logo}
                                    className="h-16 mb-6 drop-shadow-lg"
                                    alt={companyInfo.name}
                                />
                                <h2 className="font-bold text-3xl  text-white leading-tight drop-shadow-md">
                                    {companyInfo.name}
                                </h2>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/30">
                                <p className="text-white/90 text-lg leading-relaxed">
                                    {contactData.address}
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="font-bold mb-6 text-2xl text-white">
                                Hubungi Kami
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="bg-primary p-2.5 rounded-lg">
                                        <Mail size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/70 mb-1">Email</p>
                                        <a
                                            href={`mailto:${contactData.email}`}
                                            className="text-white font-medium hover:text-primary transition-colors"
                                        >
                                            {contactData.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="bg-primary p-2.5 rounded-lg">
                                        <Phone size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/70 mb-1">Telepon</p>
                                        <a
                                            href={`tel:${contactData.phone.replace(/\s/g, '')}`}
                                            className="text-white font-medium hover:text-primary transition-colors"
                                        >
                                            {contactData.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href="https://kemenkopangan.go.id/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        Kunjungi Website Resmi
                                        <span className="text-lg">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 mt-8 border-t border-white/20">
                    <p className="text-sm text-white/80 text-center">
                        {copyrightText}
                    </p>
                </div>
            </div>
        </footer>
    );
}