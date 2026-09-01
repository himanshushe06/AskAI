import { MessageSquare,MoreVertical,Trash2,Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function RecentChats({ chats = [],selectedChatId,onSelectChat,onDeleteChat}) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener( "mousedown",handleClickOutside );
        return () => {
            document.removeEventListener( "mousedown",handleClickOutside );
        };
    }, []);

    if (!chats.length) {
        return (
            <div className=" mx-1 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.015] px-4 py-7 text-center">
                <div className=" mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-600">
                    <MessageSquare
                        size={17}
                    />
                </div>

                <p className="text-xs font-medium text-slate-500">
                    No conversations yet
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-700">
                    Start a new chat to begin
                </p>
            </div>
        );
    }

    const handleSelectChat = (chat) => {
        setOpenMenuId(null);

        if (typeof onSelectChat === "function") {
            onSelectChat(chat);
        }
    };

    const handleMenuClick = ( event,chatId ) => {
        event.stopPropagation();
        setOpenMenuId( current => current === chatId ? null : chatId
        );
    };

    const handleDeleteClick = ( event,chatId ) => {
        event.stopPropagation();
        setOpenMenuId(null);
        if ( typeof onDeleteChat === "function" ) {
            onDeleteChat(chatId);
        }
    };

    const formatTime = ( dateValue ) => {
        if (!dateValue) {
            return "";
        }
        const date = new Date(dateValue);

        if ( Number.isNaN( date.getTime() )) {
            return "";
        }

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) {
            return "Just now";
        }
        if (diff < hour) {
            return `${Math.floor( diff / minute )}m`;
        }
        if (diff < day) {
            return `${Math.floor( diff / hour )}h`;
        }

        if (diff < 7 * day) {
            return `${Math.floor( diff / day )}d`;
        }
        return date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short"
            }
        );
    };

    return (
        <div className="space-y-1">
            {chats.map((chat) => {
                const selected = selectedChatId === chat.chatId;
                const menuOpen = openMenuId === chat.chatId;
                const firstUserMessage = chat.messages?.find( message => message.role === "user");

                const title = firstUserMessage?.content || chat.title || "New conversation";
                const timestamp = formatTime( chat.updatedAt || chat.createdAt );
                return (
                    <div key={chat.chatId}
                        className=" group relative "
                    >

                        <button type="button"
                            onClick={() =>
                                handleSelectChat(
                                    chat
                                )
                            }
                            className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 pr-10 text-left transition-all duration-200
                                ${
                                    selected
                                        ? ` bg-violet-500/[0.10] text-white `
                                        : ` text-slate-400 hover:bg-white/[0.035] hover:text-slate-200 `
                                }
                            `}
                        >

                            {selected && (
                                <span className=" absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-violet-400 shadow shadow-violet-400/50"/>
                            )}

                            <div className={`flex h-9w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                                    ${ selected
                                            ? ` bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/10 `
                                            : ` bg-slate-900 text-slate-600 group-hover:bg-slate-800 group-hover:text-slate-400 `
                                    }
                                `}
                            >

                                <MessageSquare
                                    size={15}
                                    strokeWidth={1.9}
                                />
                            </div>

                            <div className=" min-w-0 flex-1">
                                <p className={` truncate text-[12px] font-medium
                                        ${
                                            selected
                                                ? "text-slate-100"
                                                : "text-slate-400"
                                        }
                                    `}
                                >
                                    {title}
                                </p>


                                <div className=" mt-1 flex items-center gap-1.5">
                                    <span className=" text-[9px] text-slate-600 ">
                                        General AI
                                    </span>

                                    {timestamp && (
                                        <>
                                            <span className=" text-[8px] text-slate-800 *:">
                                                •
                                            </span>

                                            <span className="text-[9px] text-slate-700">
                                                {timestamp}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            aria-label="Chat options"
                            onClick={(event) => handleMenuClick( event, chat.chatId )}
                            className={`absolute right-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-150
                                ${
                                    menuOpen
                                        ? `bg-slate-800 text-slate-200 `
                                        : `bg-slate-950/80 text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-slate-800 hover:text-slate-200 `
                                }
                            `}
                        >

                            <MoreVertical
                                size={15}
                            />
                        </button>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className=" absolute right-1 top-[calc(100%-2px)] z-[200] w-40 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111217] p-1 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-150 "
                            >

                                <div className=" border-b border-white/[0.05] px-3 py-2 ">
                                    <p className="truncate text-[10px] font-medium text-slate-600">
                                        Conversation
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={(event) => handleDeleteClick( event, chat.chatId )}
                                    className=" flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/[0.08] hover:text-red-300 "
                                >

                                    <div className=" flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/[0.08]">
                                        <Trash2
                                            size={14}
                                        />
                                    </div>

                                    <span>
                                        Delete chat
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default RecentChats;