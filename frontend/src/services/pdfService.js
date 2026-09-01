import api from "./api";

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);
    const response = await api.post(
        "/pdfs/upload",
        formData
    );
    return response.data;
};

export const getDocuments = async () => {
    const response = await api.get(
        "/pdfs"
    );
    return response.data;
};