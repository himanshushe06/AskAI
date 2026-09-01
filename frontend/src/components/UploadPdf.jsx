import { Loader2,Upload,FileUp } from "lucide-react";

function UploadPdf({ onUpload,uploading = false }) {
    const handleChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if ( typeof onUpload !== "function" ) {
            console.error( "Upload handler is missing" );
            return;
        }

        // Only allow PDFs
        if ( file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            console.error(
                "Only PDF files are supported"
            );
            event.target.value = "";
            return;
        }

        onUpload(file);

        // Allow selecting the same file again
        event.target.value = "";
    };


    return (
        <label className={`group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-200
                ${
                    uploading
                        ? ` cursor-not-allowed border-violet-500/20 bg-violet-500/[0.06] `
                        : ` border-white/[0.07] bg-white/[0.025] hover:border-violet-500/25 hover:bg-violet-500/[0.06] `
                }
            `}
        >

            <div className={` flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                    ${
                        uploading
                            ? ` bg-violet-500/10 text-violet-400 `
                            : ` bg-slate-900 text-slate-500 group-hover:bg-violet-500/10 group-hover:text-violet-400 `
                    }
                `}
            >
                {uploading ? (
                    <Loader2
                        size={17}
                        className="animate-spin "
                    />
                ) : (
                    <FileUp
                        size={17}
                        strokeWidth={1.9}
                    />
                )}
            </div>

            <div className=" min-w-0 flex-1">
                <p className={` text-xs font-medium
                        ${
                            uploading
                                ? "text-violet-300"
                                : "text-slate-300"
                        }
                    `}
                >
                    {uploading
                        ? "Processing PDF..."
                        : "Upload PDF"
                    }
                </p>

                <p className=" mt-0.5 truncate text-[9px] text-slate-600">
                    {uploading
                        ? "Extracting document content"
                        : "Add a document to your workspace"
                    }
                </p>

            </div>
            {!uploading && (
                <Upload
                    size={15}
                    strokeWidth={1.8}
                    className=" shrink-0 text-slate-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-violet-400 "
                />
            )}

            <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleChange}
                disabled={uploading}
                className="hidden"
            />
        </label>
    );
}

export default UploadPdf;