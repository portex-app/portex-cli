/**
 * Login request parameters interface
 */
declare interface ReqLoginFrom {
    /** Username or email */
    login: string,
    /** User password */
    password: string
}

/**
 * Login response interface
 */
declare interface ResLogin {
    /** JWT authentication token */
    token: string
}

/**
 * Platform entity interface
 */
declare interface Platform {
    /** Platform creation timestamp */
    created_at: number;
    /** Platform unique identifier */
    id: string,
    /** Platform display name */
    name: string,
}

/**
 * Platform list response interface
 */
declare interface ResPlatform {
    /** Array of platform objects */
    platforms: Array<Platform>
}