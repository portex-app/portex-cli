/**
 * Public API Module
 *
 * This module handles public-facing API endpoints that don't require authentication,
 * such as login and platform information retrieval.
 */
/**
 * Authenticate user and obtain JWT token
 * @param params - Login credentials including username/email and password
 * @returns Promise<ResLogin> - Authentication response containing JWT token
 */
export declare const apiLogin: (params: ReqLoginFrom) => Promise<ResLogin>;
/**
 * Retrieve list of available platforms
 * @returns Promise<ResPlatform> - List of platform information
 */
export declare const apiGetPlatfroms: () => Promise<ResPlatform>;
