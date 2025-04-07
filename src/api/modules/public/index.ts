
import Http from "../../index.js";

export const apiLogin = async (params: ReqLoginFrom): Promise<ResLogin> => {
    const url = `/v1/login`;
    return Http.post<ResLogin>(url, params);
}

export const apiGetPlatfroms = async (): Promise<ResPlatform> => {
    const url = `/v1/platforms`;
    return Http.get<ResPlatform>(url);
}