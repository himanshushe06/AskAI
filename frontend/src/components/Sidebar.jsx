import { FileText,Plus,Sparkles,MessageSquare,Upload,ChevronRight } from "lucide-react";
import DocumentList from "./DocumentList";
import UploadPdf from "./UploadPdf";
import RecentChats from "./RecentChats";

function Sidebar({ documents = [], selectedDocument, onSelectDocument, onUpload, uploading = false, onNewChat, mode, onModeChange, chats = [], selectedChatId, onSelectChat, onDeleteChat }) {
    return (
        <aside className="flex h-full w-80 shrink-0 flex-col border-r border-white/[0.07] bg-[#08090d] text-white">

            <div className=" shrink-0 border-b border-white/[0.06] px-5 py-5 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-violet-900/30">
                            <div className=" absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"/>
                            <FileText
                                size={21}
                                strokeWidth={2}
                                className="relative text-white"
                            />
                        </div>
                        {/* NAME */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-[16px] font-semibold tracking-tight text-white" >
                                    AskAI
                                </h1>

                                <span className=" rounded-md border border-violet-400/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-300 ">
                                    AI
                                </span>

                            </div>
                            <p className=" mt-0.5 text-[11px] text-slate-500">
                                Your AI workspace
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="shrink-0 px-4 pt-4">
                <button type="button"
                    onClick={onNewChat}
                    className=" group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-900/20 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:shadow-xl hover:shadow-violet-900/30 active:scale-[0.98]"
                >
                    <div className=" pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100"/>
                    <div className=" relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 transition group-hover:bg-white/15">
                        <Plus
                            size={18}
                            strokeWidth={2.2}
                        />
                    </div>
                    <span className="relative flex-1 text-left">
                        New Chat
                    </span>
                    <ChevronRight
                        size={16}
                        className=" relative text-violet-100 transition-transform duration-200 group-hover:translate-x-1 "
                    />
                </button>
            </div>

            <div className=" min-h-0 flex-1 overflow-y-auto px-3 pb-5 pt-6
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-white/10
                    hover:[&::-webkit-scrollbar-thumb]:bg-white/20
                "
            >

                <section>
                    <div className=" mb-2 flex items-center justify-between px-2">
                        <p className=" text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Chat Modes
                        </p>
                    </div>

                    <div className="space-y-1">

                        <button 
                            type="button"
                            onClick={() => onModeChange("pdf")}
                            className={` group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200
                                ${ mode === "pdf"
                                        ? ` bg-violet-500/[0.10] text-white shadow-inner shadow-violet-500/[0.04] `
                                        : ` text-slate-400 hover:bg-white/[0.035] hover:text-slate-200 `
                                }
                            `}
                        >
                            {mode === "pdf" && (
                                <span className=" absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-violet-400 shadow shadow-violet-400"/>
                            )}

                            <div className={` flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                                    ${
                                        mode === "pdf"
                                            ? ` bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/10`
                                            : ` bg-slate-900 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300 `
                                    }
                                `}
                            >
                                <MessageSquare
                                    size={18}
                                    strokeWidth={1.9}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={` text-[13px] font-medium
                                        ${ mode === "pdf" ? "text-white" : "" }
                                    `}
                                >
                                    PDF Chat
                                </p>
                                <p className=" mt-0.5 truncate text-[11px] text-slate-600">
                                    Ask questions from documents
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => onModeChange("general")}
                            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200
                                ${
                                    mode === "general"
                                        ? ` bg-violet-500/[0.10] text-white shadow-inner shadow-violet-500/[0.04]`
                                        : ` text-slate-400 hover:bg-white/[0.035] hover:text-slate-200 `
                                }
                            `}
                        >

                            {mode === "general" && (
                                <span className=" absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-violet-400 shadow shadow-violet-400 "/>
                            )}

                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                                    ${
                                        mode === "general"
                                            ? ` bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/10 `
                                            : ` bg-slate-900 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300 `
                                    }
                                `}
                            >
                                <Sparkles
                                    size={18}
                                    strokeWidth={1.9}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className={` text-[13px] font-medium
                                        ${
                                            mode === "general"
                                                ? "text-white"
                                                : ""
                                        }
                                    `}
                                >
                                    General AI
                                </p>

                                <p className=" mt-0.5 truncate text-[11px] text-slate-600">
                                    Ask anything
                                </p>

                            </div>
                        </button>
                    </div>
                </section>

                <section className="mt-8">
                    <div className=" mb-2 flex items-centerjustify-between px-2 ">
                        <p className=" text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 ">
                            Recent Chats
                        </p>

                        {chats.length > 0 && (
                            <span className=" min-w-5 rounded-md bg-white/[0.05] px-1.5 py-0.5 text-center text-[9px] font-semibold text-slate-500">
                                {chats.length}
                            </span>
                        )}
                    </div>

                    <RecentChats
                        chats={chats}
                        selectedChatId={selectedChatId}
                        onSelectChat={onSelectChat}
                        onDeleteChat={onDeleteChat}
                    />
                </section>

                <section className="mt-8">
                    <div className=" mb-2 flex items-center justify-between px-2 ">
                        <p className=" text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Documents
                        </p>

                        {documents.length > 0 && (
                            <span className=" min-w-5 rounded-md bg-white/[0.05] px-1.5 py-0.5 text-center text-[9px] font-semibold text-slate-500">
                                {documents.length}
                            </span>
                        )}
                    </div>

                    <DocumentList
                        documents={documents}
                        selectedDocument={selectedDocument}
                        onSelectDocument={onSelectDocument}
                    />
                </section>
            </div>

            <div className=" shrink-0 border-t border-white/[0.06] bg-[#08090d] p-3 ">
                <div className=" rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.025]">
                    <UploadPdf
                        onUpload={onUpload}
                        uploading={uploading}
                    />
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;