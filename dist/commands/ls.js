import { Flags } from '@oclif/core';
import { table } from 'table';
import { apiGetApplicationList } from '../api/modules/applications/index.js';
import { BaseCommand } from '../lib/base-command.js';
import { getTableConfig } from '../utils/index.js';
var ENV_TYPE;
(function (ENV_TYPE) {
    ENV_TYPE[ENV_TYPE["dev"] = 0] = "dev";
    ENV_TYPE[ENV_TYPE["test"] = 1] = "test";
    ENV_TYPE[ENV_TYPE["prod"] = 2] = "prod";
})(ENV_TYPE || (ENV_TYPE = {}));
export default class Ls extends BaseCommand {
    /**
     * Command description for the command.
     * @type {string }
     */
    static description = '';
    /**
     * Command flags available for use.
     */
    static flags = {
        /**
         * Flag for specifying the application id.
         * @type {Flags.String}
         */
        appId: Flags.string({ char: 'i', description: 'Enter application id', hidden: true }),
        /**
         * Flag for specifying the application name.
         * @type {Flags.String}
         */
        appName: Flags.string({ char: 'n', description: 'Enter application name', hidden: true }),
        /**
         * Flag for help information.
         * @type {Flags.Help}
         */
        help: Flags.help({ char: 'h', description: 'Displays this help information.' }),
        /**
         * Flag for specifying the platform name
         */
        platform_name: Flags.string({ char: 'p', description: 'Enter platform name', hidden: true })
    };
    static summary = 'get application list';
    /**
     * Runs the command logic to fetch and display the application list.
     */
    async run() {
        const { flags: { appId, appName, platform_name } } = await this.parse(Ls);
        const params = {
            application_id: appId || undefined,
            application_name: appName || undefined,
        };
        // get platform id with platform name
        if (platform_name) {
            const platform_id = await this.getPlatformByName(platform_name);
            params.platform_id = platform_id;
        }
        // Filter out undefined properties
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        this.getApplicationList(Object.keys(filteredParams).length > 0 ? filteredParams : undefined); // Call the method to fetch and display the application list
    }
    /**
     * Fetches the list of applications from the API.
     * @async
     * @param  params - Optional query parameters to filter the applications.
     */
    async getApplicationList(params) {
        try {
            // Call the API to get the list of applications
            const res = await apiGetApplicationList(params);
            // If applications are found, display them
            if (res.applications) {
                this.showApplicationList(res.applications);
            }
            else {
                // If no applications are found, notify the user
                this.log('No application found, please create an application first');
            }
        }
        catch {
            // Handle any error that occurs while fetching the list
            this.error(new Error("Get application list error"));
        }
    }
    /**
     * Displays the list of applications in a tabular format.
     * @async
     * @param applications - The list of applications to display.
     */
    async showApplicationList(applications) {
        if (applications.length > 0) {
            // Define table column configuration
            const columns = {
                0: { alignment: 'center', verticalAlignment: 'middle', width: 30 },
                1: { alignment: 'center', verticalAlignment: 'middle', width: 20 },
                2: { alignment: 'center', verticalAlignment: 'middle', width: 13 },
                3: { alignment: 'center', verticalAlignment: 'middle', width: 20 },
                4: { alignment: 'center', verticalAlignment: 'middle', width: 8 },
                5: { alignment: 'center', verticalAlignment: 'middle', width: 8 },
                6: { alignment: 'center', verticalAlignment: 'middle', width: 8 },
                7: { alignment: 'center', verticalAlignment: 'middle', width: 8 },
            };
            const config = getTableConfig(columns, [
                { alignment: 'center', col: 0, row: 0, rowSpan: 2, verticalAlignment: 'middle' }, // "appid" merge two rows
                { alignment: 'center', col: 1, row: 0, rowSpan: 2, verticalAlignment: 'middle' }, // "app_name" merge two rows
                { alignment: 'center', col: 2, row: 0, rowSpan: 2, verticalAlignment: 'middle' }, // "platform_name" merge two rows
                { alignment: 'center', col: 3, row: 0, rowSpan: 2, verticalAlignment: 'middle' }, // "description" merge two rows
                { alignment: 'center', col: 4, colSpan: 4, row: 0, verticalAlignment: 'middle' }, // "version" merge 4 columns (horizontal)
            ]);
            // Define table headers
            const rows = [
                ['appliaction_id', 'app_name', 'platform_name', 'description', 'version', '', '', ''], // First level header
                ['', '', '', '', 'last', 'dev', 'test', 'prod'], // Second level header
            ];
            for (const application of applications) {
                const defaultItem = [
                    application.id,
                    application.name,
                    application.platform_name,
                    application.description || "-",
                    application.last_version.toString(),
                    '-',
                    '-',
                    '-',
                ];
                if (application.published_versions) {
                    const versionMap = {};
                    for (const version of application.published_versions) {
                        versionMap[ENV_TYPE[version.env]] = version.version.toString();
                    }
                    defaultItem[5] = versionMap.dev || '-';
                    defaultItem[6] = versionMap.test || '-';
                    defaultItem[7] = versionMap.prod || '-';
                }
                rows.push(defaultItem);
            }
            const output = table(rows, config);
            this.log(output);
        }
        else {
            throw new Error('No application found');
        }
    }
}
