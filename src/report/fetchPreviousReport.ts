import { getOctokit } from '@actions/github';

import { getReportTag } from '../constants/getReportTag';
import { Options } from '../typings/Options';
import { i18n } from '../utils/i18n';

export async function fetchPreviousReport(
    octokit: ReturnType<typeof getOctokit>,
    repo: { owner: string; repo: string },
    pr: { number: number },
    options: Options,
    dataCollector: any
) {
    const commentList = await octokit.paginate(
        'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
            ...repo,
            issue_number: pr.number,
        }
    );
    

    const previousReport = commentList.find((comment) =>
        comment.body?.includes(getReportTag(options))
    );

    dataCollector.info(
        i18n('stages.defaults.begin', {
            stage: i18n( `reportTag: ${getReportTag(options)},\n previousReport.body:  ${previousReport.body}`).toLowerCase(),
        })
    );

    commentList.map((comment, index) =>  dataCollector.info(
        i18n('stages.defaults.begin', {
            stage: i18n(`${index}: ${comment.body}`).toLowerCase(),
        })
    ));
    return !previousReport ? null : previousReport;
}
