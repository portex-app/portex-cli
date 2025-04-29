/**
 * Applications API Module
 *
 * This module provides functionality for managing applications, including:
 * - Creating new applications
 * - Querying application lists and details
 * - Handling application file uploads
 */
/**
 * Create a new application
 * @param params - Application creation parameters including name, description, and platform
 * @returns Promise<void>
 */
export declare const apiCreateApplication: (params: CreateApplicationRequest) => Promise<void>;
/**
 * Get application list with optional filtering
 * @param params - Optional query parameters for filtering applications
 * @returns Promise<ApplicationQueryResponse> - List of applications matching the query
 */
export declare const apiGetApplicationList: (params?: ApplicationQueryRequest) => Promise<ApplicationQueryResponse>;
/**
 * Get detailed information about a specific application
 * @param applicationId - The ID of the application
 * @returns Promise<Application> - Detailed application information
 */
export declare const apiGetApplicationDetail: (applicationId: string) => Promise<Application>;
/**
 * Get pre-upload URL for application file
 * @param applicationId - The ID of the application
 * @param md5 - MD5 hash of the file to be uploaded
 * @param description - Description of the file
 * @returns Promise<{ url: string }> - Pre-signed upload URL
 */
export declare const apiGetPreUploadUrl: (applicationId: string, md5: string, description: string) => Promise<{
    url: string;
}>;
/**
 * Upload compressed file to the specified URL
 * Handles file upload with progress tracking and metadata
 * @param params - Upload parameters including file, MD5, description and progress callback
 * @returns Promise of upload response
 */
export declare const apiPutCompressFile: (params: DeployUploadParams) => Promise<unknown>;
