import { BaseCommand } from '../lib/base-command.js';
export default class Deploy extends BaseCommand {
    /**
     * Command arguments for the command.
     */
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        path: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        description: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    /**
     * Command description for the command.
     * @type {string}
     */
    static description: string;
    static summary: string;
    run(): Promise<void>;
    /**
     * Clears old files from the package directory, keeping only the 4 most recent files.
     * @async
     * @returns {Promise<void>}
     */
    private clearOldFile;
    /**
     * Compresses the application folder into a zip file.
     * @async
     * @param {string} filePath - Path to the application folder.
     * @returns {Promise<string>} - Returns the path of the compressed zip file.
     */
    private compressFile;
    /**
     * Calculates the MD5 checksum of a file.
     * @async
     * @param {string} filePath - Path to the file.
     * @returns {Promise<string>} - Returns the MD5 checksum in base64 format.
     */
    private getFileMD5;
    /**
     * Uploads the file to the given presigned URL.
     * @async
     * @param {string} presignedUrl - The presigned URL to upload the file to.
     * @param {string} zipFilePath - The path to the zip file being uploaded.
     * @param {string} fileMD5 - The MD5 checksum of the file.
     * @param {string} description - The description of the file.
     * @returns {Promise<void>}
     */
    private uploadFile;
}
