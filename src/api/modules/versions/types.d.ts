/**
 * Type definitions for Application Versions API
 * 
 * This file contains interfaces and type definitions used for managing
 * application versions and their metadata.
 */

/**
 * Version entity interface with upload status and version number
 * Represents a single version of an application
 */
declare interface Version {
    /** Whether the version package has been successfully uploaded */
    is_uploaded: boolean,
    /** Numeric version identifier */
    version: number
}

/**
 * Create version response interface
 * Contains information about a newly created version
 */
declare interface ResCreateVersion {
    /** The version number assigned to the newly created version */
    version_number: number
}

/**
 * Get version list response interface
 * Contains a list of all versions for an application
 */
declare interface RepGetVersionList {
    /** Array of version objects containing version information */
    versions: Version[]
}