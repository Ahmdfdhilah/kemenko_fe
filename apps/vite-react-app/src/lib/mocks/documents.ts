export const documents = [
    {
        id: "1",
        title: "Laporan Audit 2024",
        thumbnail: "https://placehold.co/600x400/e3f2fd/1976d2?text=Audit",
        link: "https://drive.google.com/drive/folders/audit-folder-id",
        category: "Audit",
        lastModified: "2 hari lalu"
    },
    {
        id: "2",
        title: "Implementasi SPIP",
        thumbnail: "https://placehold.co/600x400/f3e5f5/7b1fa2?text=SPIP",
        link: "https://drive.google.com/drive/folders/spip-folder-id",
        category: "SPIP",
        lastModified: "1 minggu lalu"
    },
    {
        id: "3",
        title: "Surat Resmi",
        thumbnail: "https://placehold.co/600x400/e8f5e8/388e3c?text=Surat",
        link: "https://drive.google.com/drive/folders/surat-folder-id",
        category: "Surat",
        lastModified: "3 hari lalu"
    },
    {
        id: "4",
        title: "Pedoman PKPT",
        thumbnail: "https://placehold.co/600x400/fff3e0/f57c00?text=PKPT",
        link: "https://drive.google.com/drive/folders/pkpt-folder-id",
        category: "PKPT",
        lastModified: "5 hari lalu"
    },
    {
        id: "5",
        title: "Audit Berbasis Risiko",
        thumbnail: "https://placehold.co/600x400/fce4ec/c2185b?text=RB",
        link: "https://drive.google.com/drive/folders/rb-folder-id",
        category: "RB",
        lastModified: "1 hari lalu"
    },
    {
        id: "6",
        title: "Pemantauan & Evaluasi",
        thumbnail: "https://placehold.co/600x400/e1f5fe/0277bd?text=Monev",
        link: "https://drive.google.com/drive/folders/monev-folder-id",
        category: "Monev",
        lastModified: "4 hari lalu"
    },
    {
        id: "7",
        title: "Materi Pelatihan",
        thumbnail: "https://placehold.co/600x400/f1f8e9/558b2f?text=Diklat",
        link: "https://drive.google.com/drive/folders/diklat-folder-id",
        category: "Diklat",
        lastModified: "6 hari lalu"
    },
    {
        id: "8",
        title: "Strategi Nasional PK",
        thumbnail: "https://placehold.co/600x400/fff8e1/fbc02d?text=Stranas",
        link: "https://drive.google.com/drive/folders/stranas-folder-id",
        category: "Stranas PK",
        lastModified: "1 minggu lalu"
    },
    {
        id: "9",
        title: "Laporan Keuangan",
        thumbnail: "https://placehold.co/600x400/efebe9/5d4037?text=SPJ",
        link: "https://drive.google.com/drive/folders/spj-folder-id",
        category: "SPJ Keuangan",
        lastModified: "2 hari lalu"
    },
    {
        id: "10",
        title: "Agenda Internal",
        thumbnail: "https://placehold.co/600x400/f3e5f5/8e24aa?text=Agenda",
        link: "https://drive.google.com/drive/folders/agenda-folder-id",
        category: "Agenda Internal",
        lastModified: "3 hari lalu"
    },
    {
        id: "11",
        title: "Arsip Dokumen",
        thumbnail: "https://placehold.co/600x400/e0f2f1/00695c?text=Dokumen",
        link: "https://drive.google.com/drive/folders/dokumen-folder-id",
        category: "Dokumen",
        lastModified: "1 minggu lalu"
    },
    {
        id: "12",
        title: "Tindak Lanjut",
        thumbnail: "https://placehold.co/600x400/ede7f6/673ab7?text=Follow+Up",
        link: "https://drive.google.com/drive/folders/tindak-folder-id",
        category: "Tindak Lanjut",
        lastModified: "5 hari lalu"
    }
];

export interface Document {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    category: string;
    lastModified: string;
}
