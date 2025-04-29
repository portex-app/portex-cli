/**
 * Application Versions API Module
 *
 * This module provides functionality for managing application versions,
 * including retrieving version lists and version information.
 */
/**
 * Retrieve list of versions for an application
 * @param applicationId - The ID of the application
 * @returns Promise<RepGetVersionList> - List of versions with their upload status
 */
export declare const apiGetVersionList: (applicationId: string) => Promise<RepGetVersionList>;
