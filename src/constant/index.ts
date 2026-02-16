const constants = {
    baseApiURL: process.env.NEXT_PUBLIC_API_URL || "https://modelboss.apphero.agency/api",
    socketURL: process.env.NEXT_PUBLIC_SOCKET_URL || "https://modelboss.apphero.agency/api",
};

export const config = {
    imageUnoptimized: true,
};
export default constants;
