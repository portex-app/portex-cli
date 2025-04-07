import { Args } from '@oclif/core';
import AdmZip from "adm-zip";
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import ProgressBar from 'progress';
import { v4 as uuidv4 } from 'uuid';
import { apiGetApplicationDetail, apiGetPreUploadUrl, apiPutCompressFile } from '../api/modules/applications/index.js';
import { BaseCommand } from '../lib/base-command.js';
export default class Deploy extends BaseCommand {
    /**
     * Command arguments for the command.
     */
    static args = {
        appName: Args.string({ description: 'deploy appliaction name', required: true }),
        path: Args.string({ description: 'deploy appliaction path', required: true }),
        // eslint-disable-next-line perfectionist/sort-objects
        description: Args.string({ description: 'deploy appliaction description', required: false }),
    };
    /**
     * Command description for the command.
     * @type {string}
     */
    static description = 'deploy mini-app, upload mini-app package from application build path.';
    static summary = 'Deploy mini-app';
    async run() {
        const { args } = await this.parse(Deploy);
        const { id: application_id } = await this.getApplicationInfo({ application_name: args.appName });
        const appliaction_dir_path = path.resolve(process.cwd(), args.path);
        const description = args.description || '';
        // Compress the application file
        const zip_file_path = await this.compressFile(appliaction_dir_path);
        // Get the MD5 checksum of the compressed file
        const file_MD5 = await this.getFileMD5(zip_file_path);
        let last_version = 0;
        // Get the last version of the application
        try {
            const response = await apiGetApplicationDetail(application_id);
            last_version = response.last_version + 1;
        }
        catch {
            this.spinner.fail('Get application version info failed');
            this.spinner.stop();
            this.exit(1);
        }
        try {
            this.spinner.start('Get presigned URL...');
            const { url: presigned_url } = await apiGetPreUploadUrl(application_id, file_MD5, description);
            this.spinner.succeed('Get presigned URL success');
            if (presigned_url) {
                await this.uploadFile(presigned_url, zip_file_path, file_MD5, description);
                this.spinner.info(`Appliaction Last Version: ${last_version}`);
                this.spinner.info(`you can use 'portex publish ${args.appName} ${last_version} [-e dev|test|prod]' command to publish application`);
            }
        }
        catch {
            this.spinner.fail('Get presigned URL failed');
            this.spinner.stop();
            this.exit(1);
        }
        finally {
            this.spinner.stop();
        }
    }
    /**
     * Clears old files from the package directory, keeping only the 4 most recent files.
     * @async
     * @returns {Promise<void>}
     */
    async clearOldFile() {
        const packagePath = process.env._PORTEX_CONFIG_PACKAGE_FILE_PATH_;
        const files = fs.readdirSync(packagePath);
        const fileMap = [];
        for (const file of files) {
            const fileFullPath = path.join(packagePath, file);
            const stats = fs.statSync(fileFullPath);
            if (stats.isFile()) {
                fileMap.push({ createTime: stats.birthtimeMs, fileName: file });
            }
        }
        // Sort files by creation time (most recent first)
        fileMap.sort((a, b) => b.createTime - a.createTime);
        // Delete files older than the 4 most recent files
        const filesToDelete = fileMap.slice(4);
        for (const file of filesToDelete) {
            const fileToDeletePath = path.join(packagePath, file.fileName);
            try {
                fs.unlinkSync(fileToDeletePath);
            }
            catch {
                // Handle error if file deletion fails
            }
        }
    }
    /**
     * Compresses the application folder into a zip file.
     * @async
     * @param {string} filePath - Path to the application folder.
     * @returns {Promise<string>} - Returns the path of the compressed zip file.
     */
    async compressFile(filePath) {
        this.spinner.start(`Compressing file ${filePath}...`);
        const packagePath = process.env._PORTEX_CONFIG_PACKAGE_FILE_PATH_;
        const file = new AdmZip();
        file.addLocalFolder(filePath);
        const zipFilePath = path.join(packagePath, `${uuidv4()}.zip`);
        file.writeZip(zipFilePath);
        this.spinner.succeed(`Compression success`);
        // Clean up old files
        await this.clearOldFile();
        return zipFilePath;
    }
    /**
     * Calculates the MD5 checksum of a file.
     * @async
     * @param {string} filePath - Path to the file.
     * @returns {Promise<string>} - Returns the MD5 checksum in base64 format.
     */
    async getFileMD5(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (chunk) => {
                hash.update(chunk);
            });
            stream.on('end', () => {
                const md5Base64 = hash.digest('base64');
                resolve(md5Base64);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    /**
     * Uploads the file to the given presigned URL.
     * @async
     * @param {string} presignedUrl - The presigned URL to upload the file to.
     * @param {string} zipFilePath - The path to the zip file being uploaded.
     * @param {string} fileMD5 - The MD5 checksum of the file.
     * @param {string} description - The description of the file.
     * @returns {Promise<void>}
     */
    async uploadFile(presignedUrl, zipFilePath, fileMD5, description) {
        const zipFileBuffer = fs.readFileSync(zipFilePath);
        try {
            this.spinner.start(`Deploy file ${zipFilePath}...`);
            const bar = new ProgressBar(':bar :current/:total :percent', {
                complete: '=',
                incomplete: ' ',
                total: 100,
                width: 40,
            });
            await apiPutCompressFile({
                description,
                file: zipFileBuffer,
                md5: fileMD5,
                onUploadProgress(progressEvent) {
                    if (progressEvent.total) {
                        const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100); // 计算百分比
                        bar.update(percent / 100); // 更新进度条，进度为百分比
                    }
                },
                url: presignedUrl,
            });
            this.spinner.succeed(`Deploy success`);
        }
        catch {
            this.spinner.stop();
            throw new Error(`Deploy failed`);
        }
    }
}
