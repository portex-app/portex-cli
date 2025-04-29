/**
 * Applications API Module
 * 
 * This module provides functionality for managing applications, including:
 * - Creating new applications
 * - Querying application lists and details
 * - Handling application file uploads
 */

import Http from "../../index.js";

/**
 * Create a new application
 * @param params - Application creation parameters including name, description, and platform
 * @returns Promise<void>
 */
export const apiCreateApplication = async (params: CreateApplicationRequest): Promise<void> => Http.post<void>('/v1/applications', params)

/**
 * Get application list with optional filtering
 * @param params - Optional query parameters for filtering applications
 * @returns Promise<ApplicationQueryResponse> - List of applications matching the query
 */
export const apiGetApplicationList = async (params?: ApplicationQueryRequest): Promise<ApplicationQueryResponse> => Http.post<ApplicationQueryResponse>(`/v1/applications/query`, params)

/**
 * Get detailed information about a specific application
 * @param applicationId - The ID of the application
 * @returns Promise<Application> - Detailed application information
 */
export const apiGetApplicationDetail = async (applicationId: string): Promise<Application> => Http.get<Application>(`/v1/applications/${applicationId}`)

/**
 * Get pre-upload URL for application file
 * @param applicationId - The ID of the application
 * @param md5 - MD5 hash of the file to be uploaded
 * @param description - Description of the file
 * @returns Promise<{ url: string }> - Pre-signed upload URL
 */
export const apiGetPreUploadUrl = async (applicationId: string, md5: string, description: string): Promise<{ url: string }> => Http.post<{ url: string }>(`/v1/applications/${applicationId}/pre-upload`, {
    description,
    md5
})

/**
 * Upload compressed file to the specified URL
 * Handles file upload with progress tracking and metadata
 * @param params - Upload parameters including file, MD5, description and progress callback
 * @returns Promise of upload response
 */
export const apiPutCompressFile = (params: DeployUploadParams) => {
    const { description, file, md5, onUploadProgress, url } = params;
    // Set up request headers with MD5 and content type
    const request_header: Record<string, string> = {
        "Content-MD5": md5,
        "Content-Type": "application/zip",
        "x-amz-meta-authorization": '',
    }
    // Add description to headers if provided
    if (description) {
        request_header["x-amz-meta-description"] = encodeURIComponent(description);
    }

    return Http.put(url, file, {
        headers: request_header,
        loading: false,
        onUploadProgress: onUploadProgress ? (progressEvent: unknown) => onUploadProgress(progressEvent as ProgressEvent<EventTarget>) : undefined,
        timeout: 600_000 // 10 minutes timeout
    })
}


