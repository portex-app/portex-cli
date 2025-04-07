declare interface Version {
    is_uploaded: boolean,
    version: number
}

declare interface ResCreateVersion {
    version_number: number
}

declare interface RepGetVersionList {
    versions: Version[]
}