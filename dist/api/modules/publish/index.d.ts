/**
 * Application Publishing API Module
 *
 * This module provides functionality for publishing and unpublishing application versions
 * to different environments (dev, prod, test, etc.).
 */
/**
 * Publish an application version to a specific environment
 * @param params - Publishing parameters including application ID, version number, and environment
 * @returns Promise<void>
 */
export declare const apiPublishApplication: (params: PublishApplicationRequest) => Promise<void>;
/**
 * Unpublish an application version from a specific environment
 * @param params - Unpublishing parameters including application ID, version number, and environment
 * @returns Promise<void>
 */
export declare const apiUnPublishApplication: (params: UnPublishApplicationRequest) => Promise<void>;
