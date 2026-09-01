import { useEffect,useRef,useState } from "react";

import { Copy,Check,Menu,X,Send,Sparkles,FileText,Loader2,User,Paperclip } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllChats,getChat,sendChat,deleteChat } from "../services/chatService";

import { getDocuments,uploadPdf } from "../services/pdfService";

import { askQuestion } from "../services/ragService";

const formatMessage = (text = "") => {
    return text
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(
            /\*(.*?)\*/g,
            "<em>$1</em>"
        )
        .replace(
            /`([^`]+)`/g,
            '<code class="rounded-md bg-slate-100 px-1.5 py-0.5 text-violet-700">$1</code>'
        )
        .replace(
            /\n/g,
            "<br />"
        );
};

function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mode, setMode] = useState("general");
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [generalMessages, setGeneralMessages] = useState([]);
    const [pdfMessages, setPdfMessages] = useState([]);
    const [generalQuestion, setGeneralQuestion] = useState("");
    const [pdfQuestion, setPdfQuestion] = useState("");
    const [generalLoading, setGeneralLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);
    const messages = mode === "general" ? generalMessages : pdfMessages;
    useEffect(() => {
        if (!toast) {
            return;
        }

        const timer = setTimeout(() => {
                setToast(null);
            }, 3000);

        return () =>
            clearTimeout(timer);

    }, [toast]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [ generalMessages,pdfMessages ]);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const result = await getDocuments();
                setDocuments( result.documents || [] );
            } catch (error) {
                console.error(
                    "Failed to load documents:",
                    error
                );
            }
        };
        loadDocuments();
    }, []);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const result = await getAllChats();
                setChats( result.chats || [] );
            } catch (error) {
                console.error( "Failed to load chats:",error );
            }
        };
        loadChats();
    }, []);

    const handleSelectChat = async (chat) => {
        try {
            setSelectedChatId(chat.chatId);
            setChatId( chat.chatId );
            setMode("general");
            setSidebarOpen(false);
            const result = await getChat( chat.chatId );
            const loadedMessages = result.chat?.messages || [];
            setGeneralMessages( loadedMessages );
        } catch (error) {
            console.error( "Failed to load chat:", error );
        }
    };

    const handleNewChat = () => {
        setSelectedChatId(null);
        setChatId(null);
        setGeneralMessages([]);
        setPdfMessages([]);
        setGeneralQuestion("");
        setPdfQuestion("");
        setSidebarOpen(false);
    };

    const handleDeleteChat = async ( chatIdToDelete ) => {
        try {
            await deleteChat( chatIdToDelete );
            setChats( previousChats => previousChats.filter(chat => chat.chatId !== chatIdToDelete ));
            if ( selectedChatId === chatIdToDelete ) {
                setSelectedChatId(null);
                setChatId(null);
                setGeneralMessages([]);
                setGeneralQuestion("");
            }

            setToast({
                type: "success",
                message: "Conversation deleted successfully"
            });

        } catch (error) {
            console.error( "Delete chat failed:", error );
            setToast({
                type: "error",
                message: error.response?.data?.message || "Failed to delete conversation"
            });
        }
    };

    const handleSelectDocument = ( document ) => {
        setSelectedDocument( document );
        setMode("pdf");
        setPdfMessages([]);
        setPdfQuestion("");
        setSidebarOpen(false);
    };

    const handleUpload = async ( file ) => {
        try {
            setUploading(true);
            const result = await uploadPdf(file);
            setToast({
                type: "success",
                message: "Your PDF is ready for AI chat."
            });

            const documentsResult = await getDocuments();
            setDocuments( documentsResult.documents || [] );
        } catch (error) {
            console.error( "PDF upload failed:", error );

            setToast({
                type: "error",
                message: error.response?.data?.message || "Unable to process the PDF."
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSendGeneralMessage =  async () => {
            const question = generalQuestion.trim();
            if ( !question || generalLoading ) {
                return;
            }

            setGeneralQuestion("");
            const userMessage = {
                role: "user",
                content: question,
                createdAt: new Date()
            };

            setGeneralMessages( previous => [ ...previous, userMessage ]);
            setGeneralLoading(true);
            let assistantText = "";
            setGeneralMessages( previous => [ ...previous,{
                        role: "assistant",
                        content: "",
                        createdAt:
                            new Date()
                    }
                ]
            );
            try {
                const result = await sendChat({
                        chatId,
                        message: question,
                        onChunk: (chunk) => { assistantText += chunk;
                            setGeneralMessages( previous => {
                                    const updated = [...previous];
                                    const lastIndex = updated.length - 1;
                                    updated[lastIndex] = { ...updated[lastIndex],
                                        content: assistantText
                                    };
                                    return updated;
                                }
                            );
                        }
                    });
                const newChatId = result.chatId;
                if ( newChatId && newChatId !== chatId ) {
                    setChatId( newChatId );
                    setSelectedChatId( newChatId );
                    const chatsResult = await getAllChats();
                    setChats( chatsResult.chats || [] );
                }
            } catch (error) {
                console.error("General chat failed:", error);
                setGeneralMessages( previous => {
                        const updated = [...previous];
                        updated[ updated.length - 1 ] = {
                            role: "assistant",
                            content: "Sorry, something went wrong while generating the answer."
                        };
                        return updated;
                    }
                );
            } finally {
                setGeneralLoading(false);
            }
        };


    const handleSendPdfMessage = async () => {
        const question = pdfQuestion.trim();
        if ( !question || pdfLoading || !selectedDocument) {
            return;
        }
        setPdfQuestion("");

        const userMessage = { 
            role: "user",
            content: question,
            createdAt: new Date()
        };

        setPdfMessages( previous => [ ...previous,userMessage ] );
        setPdfLoading(true);
        try {
            const result = await askQuestion({
                        question,
                        documentId: selectedDocument.documentId
                    });

            const answer = result.answer || "I couldn't find an answer in the uploaded document.";
            setPdfMessages( previous => [ ...previous, {
                    role: "assistant",
                    content: answer,
                    sources: result.sources || [],
                    createdAt: new Date()
                    }]
                );
            } catch (error) {
                console.error( "PDF question failed:", error );
                setPdfMessages( previous => [ ...previous,
                        {
                            role: "assistant",
                            content: "Sorry, I couldn't process that question."
                        }
                    ]
                );
            } finally {
                setPdfLoading(false);
            }
        };

    const handleSend = () => {
        if (mode === "general") {
            handleSendGeneralMessage();
        } else {
            handleSendPdfMessage();
        }
    };

    const handleKeyDown = ( event ) => {
        if ( event.key === "Enter" && !event.shiftKey ) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleCopy = async ( text, index ) => {
        try {
            await navigator.clipboard.writeText( text );
            setCopiedIndex(index);
            setTimeout(() => { 
                setCopiedIndex(null);
            }, 1500);
        } catch (error) {
            console.error( "Copy failed:", error );
        }
    };

    const generalSuggestions = [
        "Explain Docker in simple terms",
        "What is REST API?",
        "Explain microservices",
        "What is Kubernetes?"
    ];

    const pdfSuggestions = [
        "Summarize this document",
        "What are the main topics?",
        "Explain the important concepts",
        "What should I study from this?"
    ];
    
    const suggestions = mode === "general" ? generalSuggestions : pdfSuggestions;

    const renderMessage = ( message,index ) => {
        const isUser =  message.role === "user";
        return (
            <div key={`${index}-${message.createdAt || ""}`}
                className={`flex w-full gap-4 py-5
                    ${
                        isUser ? "justify-end" : "justify-start"
                    }
                `}
            >
                {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
                        <Sparkles size={17}/>
                    </div>
                )}

                <div className={`max-w-[82%] ${ isUser ? "order-first" : "" }`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-7
                        ${
                            isUser ? ` rounded-br-md bg-violet-600 text-white shadow-lg shadow-violet-950/20 `
                                    : ` bg-white text-slate-700 ring-1 ring-slate-200 shadow-sm`
                            }
                        `}
                    >

                        {message.content ? (
                            <div className=" whitespace-pre-wrap break-words "
                                dangerouslySetInnerHTML={{ __html: formatMessage( message.content )}}
                            />
                        ) : (
                            <div className=" flex items-center gap-2 text-slate-400 ">
                                <span> Thinking </span>
                                <span className="flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 "/>
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]"/>
                                </span>
                            </div>
                        )}
                    </div>

                    {!isUser && message.content && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleCopy( message.content, index )}
                                    className=" inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                    {copiedIndex === index ? (
                                        <Check size={12} />
                                    ) : (
                                        <Copy size={12} />
                                    )}
                                    {
                                        copiedIndex === index ? "Copied" : "Copy"
                                    }
                                </button>
                            </div>
                        )}
                    {
                        !isUser && message.sources?.length > 0 && (
                            <div className=" mt-3 space-y-2 ">
                                <p className=" text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Sources
                                </p>

                                {
                                    message.sources.map(( source, sourceIndex ) => (
                                        <div key={ sourceIndex }
                                            className=" rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm" 
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText size={13}
                                                    className=" text-violet-500"
                                                />
                                                <span>
                                                    {
                                                        source.fileName || source.metadata?.fileName || `Source ${sourceIndex + 1}`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                </div>

                {
                    isUser && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                            <User size={16}/>
                        </div>
                )}
            </div>
        );
    };
    const renderEmptyState = () => {
        return (
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-20">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-lg shadow-violet-100">
                    {
                        mode === "pdf" 
                            ? <FileText size={28} /> 
                            : <Sparkles size={28} />
                    }
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {
                        mode === "pdf"
                            ? selectedDocument ? `Ask ${selectedDocument.fileName}` : "Chat with your PDF"
                            : "How can I help you?"
                    }
                </h2>
                <p className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
                    {
                        mode === "pdf"
                            ? selectedDocument
                                ? "Ask questions and get answers directly from your uploaded document."
                                : "Select a document from the sidebar to start asking questions."
                            : "Ask anything, get explanations, explore ideas, or search the web for current information."
                    }
                </p>
                {
                    (mode === "general" || selectedDocument) && (
                    <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                        {
                            suggestions.map( (suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => {
                                        if ( mode === "general" ) {
                                            setGeneralQuestion( suggestion );
                                        } else {
                                            setPdfQuestion( suggestion );
                                        }
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
                                    {suggestion}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="relative flex h-screen overflow-hidden bg-slate-50 text-slate-900">
            {
                toast && (
                    <div className="fixed right-5 top-5 z-[9999] animate-in slide-in-from-right-5 fade-in duration-300">
                        <div className="flex min-w-[300px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                    ${
                                        toast.type === "success"
                                            ? ` bg-emerald-50 text-emerald-600 `
                                            : ` bg-red-50 text-red-600 `
                                    }
                                `}
                            >

                            {
                                toast.type === "success" ? (
                                <Check size={17}/>
                            ) : (
                                <X size={17}/>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 ">
                                {
                                    toast.type === "success"
                                        ? "Success"
                                        : "Something went wrong"
                                }
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {toast.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {
                sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={() => setSidebarOpen(false) }
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    />
                )}
            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                <Sidebar
                    documents={ documents }
                    selectedDocument={ selectedDocument }
                    onSelectDocument={ handleSelectDocument }
                    onUpload={ handleUpload }
                    uploading={ uploading }
                    onNewChat={ handleNewChat }
                    mode={ mode }
                    onModeChange={ setMode }
                    chats={ chats }
                    selectedChatId={ selectedChatId }
                    onSelectChat={ handleSelectChat }
                    onDeleteChat={ handleDeleteChat }
                />
            </div>

            <main className="flex min-w-0 flex-1 flex-col bg-slate-50">
                <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6 ">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true) }
                        className=" mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden">
                        <Menu size={20}/>
                    </button>

                    <div className=" flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                            {
                                mode === "pdf"
                                    ? <FileText size={17} />
                                    : <Sparkles size={17} />
                            }
                        </div>

                        <div className=" min-w-0 ">
                            <h1 className="truncate text-sm font-semibold text-slate-900">
                                {
                                    mode === "pdf"
                                        ? selectedDocument?.fileName || "PDF Chat"
                                        : "General AI"
                                }
                            </h1>

                            <p className=" text-[11px] text-slate-500">
                                {
                                    mode === "pdf"
                                        ? "Document assistant"
                                        : "AI assistant"
                                }
                            </p>
                        </div>
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
                    <div className="mx-auto min-h-full w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                        {
                            messages.length === 0
                                ? renderEmptyState()
                                : (
                                <>
                                    {messages.map( renderMessage )}
                                    <div ref={ messagesEndRef } />
                                </>
                            )}
                    </div>
                </div>

                <div className="shrink-0 border-t border-slate-200 bg-white px-4 pb-4 pt-3 sm:px-6">
                    <div className="mx-auto max-w-4xl">
                        <div className=" relative rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/10">
                            <textarea
                                value={
                                    mode === "general"
                                        ? generalQuestion
                                        : pdfQuestion
                                }
                                onChange={(event) => {
                                    if (mode === "general") {
                                        setGeneralQuestion( event.target.value );
                                    } else {
                                        setPdfQuestion( event.target.value );
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                disabled={
                                    mode === "general"
                                        ? generalLoading
                                        : pdfLoading
                                }

                                placeholder={
                                    mode === "pdf"
                                        ? selectedDocument
                                            ? "Ask a question about your PDF..."
                                            : "Select a PDF first..."
                                        : "Ask anything..."
                                }
                                rows={1}
                                className=" block min-h-[56px] max-h-32 w-full resize-none overflow-y-auto rounded-2xl bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"/>
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={
                                    mode === "general"
                                        ? ( !generalQuestion.trim() || generalLoading )
                                        : ( !pdfQuestion.trim() || pdfLoading || !selectedDocument )
                                }
                                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-md shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none">
                                {(
                                    mode === "general"
                                        ? generalLoading
                                        : pdfLoading
                                ) ? (
                                    <Loader2 size={15} className="animate-spin"/>
                                ) : (
                                    <Send size={15} strokeWidth={2.2}/>
                                )}
                            </button>
                        </div>

                        <p className=" mt-2 text-center text-[10px] text-slate-400 ">
                            {mode === "general"
                                ? "AI can make mistakes. Verify important information."
                                : "Answers are generated from your uploaded document."
                            }
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chat;