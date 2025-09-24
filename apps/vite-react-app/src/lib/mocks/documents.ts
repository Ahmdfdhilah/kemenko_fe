// Enhanced sample data without starred functionality
export const documents = [
    {
        id: "1",
        title: "Audit Report 2024",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/audit-folder-id",
        category: "Audit",
        lastModified: "2 days ago"
    },
    {
        id: "2",
        title: "SPIP Implementation",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/spip-folder-id",
        category: "SPIP",
        lastModified: "1 week ago"
    },
    {
        id: "3",
        title: "Official Letters",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/surat-folder-id",
        category: "Surat",
        lastModified: "3 days ago"
    },
    {
        id: "4",
        title: "PKPT Guidelines",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/pkpt-folder-id",
        category: "PKPT",
        lastModified: "5 days ago"
    },
    {
        id: "5",
        title: "Risk Based Audit",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/rb-folder-id",
        category: "RB",
        lastModified: "1 day ago"
    },
    {
        id: "6",
        title: "Monitoring & Evaluation",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/monev-folder-id",
        category: "Monev",
        lastModified: "4 days ago"
    },
    {
        id: "7",
        title: "Training Materials",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/diklat-folder-id",
        category: "Diklat",
        lastModified: "6 days ago"
    },
    {
        id: "8",
        title: "National Strategy PK",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/stranas-folder-id",
        category: "Stranas PK",
        lastModified: "1 week ago"
    },
    {
        id: "9",
        title: "Financial Reports",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/spj-folder-id",
        category: "SPJ Keuangan",
        lastModified: "2 days ago"
    },
    {
        id: "10",
        title: "Internal Agenda",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/agenda-folder-id",
        category: "Agenda Internal",
        lastModified: "3 days ago"
    },
    {
        id: "11",
        title: "Document Archive",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/dokumen-folder-id",
        category: "Dokumen",
        lastModified: "1 week ago"
    },
    {
        id: "12",
        title: "Follow Up Actions",
        thumbnail: "https://placehold.co/600x400",
        link: "https://drive.google.com/drive/folders/tindak-folder-id",
        category: "Tindak Lanjut",
        lastModified: "5 days ago"
    }
]

export interface Document {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    category: string;
    lastModified: string;
}