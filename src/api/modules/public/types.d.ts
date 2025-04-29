/**
 * Type definitions for Public API
 * 
 * This file contains interfaces and type definitions used for public API endpoints,
 * including authentication and platform information.
 */

/**
 * Login request parameters interface
 * Defines the structure for user authentication requests
 */
declare interface ReqLoginFrom {
    /** Username or email address for authentication */
    login: string,
    /** User's password for authentication */
    password: string
}

/**
 * Login response interface
 * Contains the authentication token returned after successful login
 */
declare interface ResLogin {
    /** JWT authentication token for subsequent API requests */
    token: string
}

/**
 * Platform entity interface
 * Represents a platform in the system
 */
declare interface Platform {
    /** Platform creation timestamp in Unix epoch format */
    created_at: number;
    /** Unique identifier for the platform */
    id: string,
    /** Display name of the platform */
    name: string,
}

/**
 * Platform list response interface
 * Contains an array of platform information
 */
declare interface ResPlatform {
    /** Array of platform objects containing platform details */
    platforms: Array<Platform>
}