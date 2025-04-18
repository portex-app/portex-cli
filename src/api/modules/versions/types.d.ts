/**
 * Version entity interface with upload status and version number
 */
declare interface Version {
    /** Whether the version has been uploaded */
    is_uploaded: boolean,
    /** Version number */
    version: number
}

/**
 * Create version response interface
 */
declare interface ResCreateVersion {
    /** Newly created version number */
    version_number: number
}

/**
 * Get version list response interface
 */
declare interface RepGetVersionList {
    /** Array of version objects */
    versions: Version[]
}