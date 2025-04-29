/**
 * Application Publishing API Module
 *
 * This module provides functionality for publishing and unpublishing application versions
 * to different environments (dev, prod, test, etc.).
 */
import Http from "../../index.js";
/**
 * Publish an application version to a specific environment
 * @param params - Publishing parameters including application ID, version number, and environment
 * @returns Promise<void>
 */
export const apiPublishApplication = async (params) => {
    const url = `/v1/applications/${params.application_id}/versions/${params.version_number}/publish`;
    return Http.post(url, params.PublishApplicationVersionRequest);
};
/**
 * Unpublish an application version from a specific environment
 * @param params - Unpublishing parameters including application ID, version number, and environment
 * @returns Promise<void>
 */
export const apiUnPublishApplication = async (params) => {
    const url = `/v1/applications/${params.application_id}/versions/${params.version_number}/un-publish`;
    return Http.post(url, params.PublishApplicationVersionRequest);
};
