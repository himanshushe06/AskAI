import api from "./api";

export const getAllChats = async () => {
    const response = await api.get(
        "/chat"
    );
    return response.data;

};

export const getChat = async (chatId) => {
    const response = await api.get(
        `/chat/${chatId}`
    );
    return response.data;
};

export const sendChat = async ({ chatId,message,onChunk }) => { 
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatId,
                message
            })
        }
    );
    if (!response.ok) {
        let errorMessage = "Failed to send message";
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;

        throw new Error(errorMessage);
    }
    if (!response.body) {
        throw new Error(
            "Streaming response is not supported by this browser."
        );
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullResponse = "";
    while (true) {
        const { value,done } = await reader.read();
        if (done) {
            break;
        }

        const chunk = decoder.decode( value,{ stream: true } );
        fullResponse += chunk;
        if (onChunk) {
            onChunk(chunk);
        }
    }


    const remaining = decoder.decode();
    if (remaining) {
        fullResponse += remaining;
        if (onChunk) {
            onChunk(remaining);
        }
    }


    return {
        answer: fullResponse,
        chatId:
            response.headers.get(
                "X-Chat-Id"
            )
    };
};
export const deleteChat = async (chatId) => {
    if (!chatId) {
        throw new Error(
            "Chat ID is missing"
        );
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/${chatId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }
    if (!response.ok) {
        throw new Error(
            data?.message ||
            `Failed to delete chat (${response.status})`
        );
    }
    return data;
};