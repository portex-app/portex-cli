import { apiPublishApplication } from '../api/modules/publish/index.js';
import { apiGetVersionList } from '../api/modules/versions/index.js';
export async function getVersionList(applicationId) {
    const { versions } = await apiGetVersionList(applicationId);
    return versions ?? [];
}
export async function publishApp(params) {
    await apiPublishApplication({
        application_id: params.applicationId,
        version_number: params.version,
        PublishApplicationVersionRequest: { env: params.env },
    });
    return params.env === 'prod'
        ? `https://${params.appName}.portex.app/`
        : `https://${params.appName}.${params.env}.portex.app/`;
}
