export const api = (url: string, options: RequestInit = {}) => {
    
    const token = localStorage.getItem("token");

    return fetch(`http://localhost:4000${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    
};
