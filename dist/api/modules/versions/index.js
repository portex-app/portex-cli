/**
 * Application Versions API Module
 *
 * This module provides functionality for managing application versions,
 * including retrieving version lists and version information.
 */
import Http from "../../index.js";
/**
 * Retrieve list of versions for an application
 * @param applicationId - The ID of the application
 * @returns Promise<RepGetVersionList> - List of versions with their upload status
 */
export const apiGetVersionList = async (applicationId) => {
    const url = `/v1/applications/${applicationId}/versions`;
    return Http.get(url);
};
