import { Card, CardContent } from "@workspace/ui/components/card"
import { AnimatedSection } from "@workspace/ui/components/ui/animated-section"
import { Section } from "@workspace/ui/components/ui/section"
import {  Search, Folder, FolderUpIcon } from "lucide-react"
import placeholderImg from '@/assets/placeholder/placeholder.jpeg';

const Gallery = () => {
    const features = [
        {
            icon: <FolderUpIcon className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />,
            title: "Simpan Drive",
            description: "Menyimpan dokumen dengan mudah ke dalam sistem folder digital terintegrasi.",
        },
        {
            icon: <Search className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />,
            title: "Pencarian Cepat",
            description: "Temukan dokumen dalam hitungan detik dengan fitur pencarian cerdas.",
        },
        {
            icon: <Folder className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />,
            title: "Manajemen Folder",
            description: "Atur folder sesuai kategori dan kebutuhan organisasi secara rapi.",
        },
    ]

    return (
        <Section className="lg:pl-12" containerClass="flex flex-col lg:flex-row min-h-screen gap-6 justify-between text-center">
            <AnimatedSection className="flex-1 order-2 lg:order-1">
                <div className="h-full flex flex-col lg:flex-row gap-8 items-center justify-center p-6">
                    <div className="flex gap-4 w-full h-full">
                        {/* First container */}
                        <div className="flex flex-col gap-8 flex-1 mb-16">
                            <div className="flex-1">
                                <img
                                    src={placeholderImg}
                                    alt="Gallery image 1"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <img
                                    src={placeholderImg}
                                    alt="Gallery image 2"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Second container with top margin */}
                        <div className="flex flex-col gap-8 flex-1 mt-16">
                            <div className="flex-1 bg-white/20 rounded-lg overflow-hidden">
                                <img
                                    src={placeholderImg}
                                    alt="Gallery image 3"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 bg-white/20 rounded-lg overflow-hidden">
                                <img
                                    src={placeholderImg}
                                    alt="Gallery image 4"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="space-y-6 lg:hidden">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-card-secondary border-none max-w-xl">
                                <CardContent className="flex gap-3 p-4 items-center">
                                    {feature.icon}
                                    <div className="flex flex-col items-start text-left">
                                        <div className="text-xl lg:text-2xl font-extrabold text-foreground">
                                            {feature.title}
                                        </div>
                                        <div className="text-foreground text-left">
                                            {feature.description}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection className="flex-1 order-1 lg:order-2">
                <div className="h-full px-8">
                    <div className="mb-2 text-left max-w-xl">
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4">
                            Apa saja<span className="text-tertiary"> Fitur SIMF</span>
                        </h2>
                        <p className="text-foreground text-lg  tracking-wide pb-4">
                            Lihat bagaimana SIMF membantu organisasi dalam mengelola dokumen digital secara mudah, cepat, dan aman.
                        </p>
                    </div>

                    <div className="space-y-6 hidden lg:block">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-card-secondary border-none max-w-xl">
                                <CardContent className="flex gap-3 p-4 items-center">
                                    <div className="bg-primary/20 rounded-full p-3">
                                        {feature.icon}
                                    </div>
                                    <div className="flex flex-col items-start text-left">
                                        <div className="text-xl lg:text-2xl font-extrabold text-foreground">
                                            {feature.title}
                                        </div>
                                        <div className="text-foreground text-left">
                                            {feature.description}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
        </Section>
    );
};

export default Gallery;