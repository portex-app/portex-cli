/**
 * Public API Module
 * 
 * This module handles public-facing API endpoints that don't require authentication,
 * such as login and platform information retrieval.
 */

import Http from "../../index.js";

/**
 * Authenticate user and obtain JWT token
 * @param params - Login credentials including username/email and password
 * @returns Promise<ResLogin> - Authentication response containing JWT token
 */
export const apiLogin = async (params: ReqLoginFrom): Promise<ResLogin> => {
    const url = `/v1/login`;
    return Http.post<ResLogin>(url, params);
}

/**
 * Retrieve list of available platforms
 * @returns Promise<ResPlatform> - List of platform information
 */
export const apiGetPlatfroms = async (): Promise<ResPlatform> => {
    const url = `/v1/platforms`;
    return Http.get<ResPlatform>(url);
}