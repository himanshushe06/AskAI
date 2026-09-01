import { FileText,FileCheck2,ChevronRight } from "lucide-react";

function DocumentList({ documents = [], selectedDocument, onSelectDocument }) {
    if (!documents.length) {
        return (
            <div className="px-2 py-4">
                <div className=" flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015] px-4 py-7" >
                    <div className=" mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-600 ring-1 ring-white/[0.04] ">
                        <FileText
                            size={19}
                            strokeWidth={1.8}
                        />
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                        No documents yet
                    </p>

                    <p className="mt-1 max-w-[180px] text-center text-[10px] leading-4 text-slate-700">
                        Upload a PDF to start asking questions
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-1">
            {documents.map((document) => {
                const selected = selectedDocument?.documentId === document.documentId;
                return (
                    <button
                        key={document.documentId}
                        type="button"
                        onClick={() =>
                            onSelectDocument(document)
                        }
                        className={` group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-all duration-200
                            ${
                                selected
                                    ? ` bg-violet-500/[0.10] text-white`
                                    : ` text-slate-400 hover:bg-white/[0.035] hover:text-slate-200`
                            }
                        `}
                    >
                        {selected && (
                            <span className=" absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-violet-400 shadow shadow-violet-400/40"/>
                        )}

                        <div
                            className={` relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                                ${
                                    selected
                                        ? ` bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/10 `
                                        : ` bg-slate-900 text-slate-600 group-hover:bg-slate-800 group-hover:text-slate-400 `
                                }
                            `}
                        >
                            {selected ? (
                                <FileCheck2
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <FileText
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            )}
                        </div>

                        <div className=" min-w-0 flex-1 ">
                            <p title={ document.fileName }
                                className={` truncate text-[12px] font-medium leading-5
                                    ${
                                        selected
                                            ? "text-slate-100"
                                            : "text-slate-300"
                                    }
                                `}
                            >
                                {document.fileName}
                            </p>

                            <div className=" mt-0.5 flex items-center gap-1.5 ">
                                <span className=" rounded bg-slate-800 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-600 ">
                                    PDF
                                </span>

                                <span className=" text-[9px] text-slate-700 ">
                                    •
                                </span>

                                <span className=" text-[9px] text-slate-600">
                                    {document.chunkCount
                                        ? `${document.chunkCount} chunks`
                                        : "Document"
                                    }
                                </span>
                            </div>
                        </div>

                        {selected && (
                            <span className=" h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow shadow-violet-400/50 "/>
                        )}

                        {!selected && (
                            <ChevronRight
                                size={14}
                                className=" shrink-0 -translate-x-1 text-slate-700 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-slate-500 group-hover:opacity-100"/>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default DocumentList;