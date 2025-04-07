import Http from "../../index.js";
export const apiLogin = async (params) => {
    const url = `/v1/login`;
    return Http.post(url, params);
};
export const apiGetPlatfroms = async () => {
    const url = `/v1/platforms`;
    return Http.get(url);
};
