"use client"

import { FileCard } from "@/components/common/FileCard"
import { documents } from "@/lib/mocks/documents"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Search } from "lucide-react"
import { useState } from "react"

export default function DashboardContent() {
    const [documentsData, setDocumentsData] = useState(documents)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("recent")

    // Set to true if user is admin
    const isAdmin = true

    const handleUpdate = (title: string) => {
        console.log(`Update ${title}`)
        // Add your update logic here
    }

    const handleDelete = (title: string) => {
        console.log(`Delete ${title}`)
        // Add your delete logic here
    }

    const handleToggleStar = (title: string) => {
        setDocumentsData(prev =>
            prev.map(doc =>
                doc.title === title
                    ? { ...doc, isStarred: !doc.isStarred }
                    : doc
            )
        )
    }

    // Filter documents based on search term and active tab
    const filteredDocuments = documentsData.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === "starred") {
            return matchesSearch && doc.isStarred
        }

        return matchesSearch
    })

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-card px-4 md:px-6 py-4 shadow-sm">
                <div className="w-full max-w-md ml-0 md:ml-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Search documents and categories..."
                            className="pl-10 border-border focus:border-primary focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-card border">
                            <TabsTrigger
                                value="recent"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                Recent
                            </TabsTrigger>
                            <TabsTrigger
                                value="starred"
                                className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 dark:data-[state=active]:bg-yellow-500/20 dark:data-[state=active]:text-yellow-400"
                            >
                                Starred ({documentsData.filter(doc => doc.isStarred).length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground text-lg mb-2">No documents found</div>
                        <div className="text-muted-foreground/70 text-sm">
                            {activeTab === "starred"
                                ? "Star some documents to see them here"
                                : "Try adjusting your search terms"
                            }
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredDocuments.map((doc) => (
                            <FileCard
                                key={doc.title}
                                title={doc.title}
                                thumbnail={doc.thumbnail}
                                link={doc.link}
                                category={doc.category}
                                isStarred={doc.isStarred}
                                lastModified={doc.lastModified}
                                isAdmin={isAdmin}
                                onUpdate={() => handleUpdate(doc.title)}
                                onDelete={() => handleDelete(doc.title)}
                                onToggleStar={() => handleToggleStar(doc.title)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}