import { RestClient } from '@uniqs/apis';

import { API } from '@config/consts';
import { GroupOrTeam, InterviewType, SMSType, Status, Step } from '@config/enums';
import { Interview, Recruitment, Member } from '@config/types';
import { stores } from '@stores/index';
import { primitiveStorage, objectStorage } from '@utils/storage';

const { $application, $component, $member, $recruitment } = stores;

const client = new RestClient(API);

client.addRequestInterceptor((config) => {
    (config.headers as Record<string, string>).Authorization = `Bearer ${$member.token}`;
    return config;
});

const apiWrapper = client.apiWrapper(
    (on) => $component.setProgress(on),
    (message, status) => $component.enqueueSnackbar(message, status),
);

export const allocateMany = (type: InterviewType, aids: string[]) =>
    apiWrapper(
        () => client.allocateMany(type, aids),
        (allocations) => {
            $application.allocateMany(
                allocations.map(({ aid, time }) => ({ aid, time: time ? new Date(time) : undefined })),
                type,
            );
            const failed = allocations.filter(({ time }) => !time).length;
            if (failed) {
                $component.enqueueSnackbar(`有${failed}位候选人没有分配到时间(不包括未选择时间的)`, Status.info);
            } else {
                $component.enqueueSnackbar('所有候选人均分配了时间(不包括未选择时间的)', Status.success);
            }
        },
    );

export const allocateOne = (type: InterviewType, aid: string, time: Date) =>
    apiWrapper(
        () => client.allocateOne(type, aid, time),
        () => {
            $application.allocateOne(type, aid, time);
            $component.enqueueSnackbar('设置成功', Status.success);
        },
    );

export const getApplications = (rid: string) => {
    const viewing = primitiveStorage.get('viewingId');
    return apiWrapper(
        async () => {
            const applications = await objectStorage.get('applications');
            let max = new Date(0).toJSON();
            if (applications && rid === viewing) {
                $application.setAll(applications);
                for (const [, { updatedAt }] of applications) {
                    if (max < updatedAt) {
                        max = updatedAt;
                    }
                }
            }
            return await client.getApplications(rid, new Date(max));
        },
        (applications) => {
            if (rid !== viewing) {
                $application.clear();
            }
            $application.setMany(applications);
            $recruitment.setViewingRecruitment(rid);
            $component.enqueueSnackbar('成功获取候选人信息', Status.success);
        },
    );
};

export const moveApplication = (id: string, from: Step, to: Step) =>
    apiWrapper(
        () => {
            $application.moveOne(id, to);
            return client.moveApplication(id, from, to);
        },
        () => $component.enqueueSnackbar('移动成功', Status.success),
        () => $application.moveOne(id, from),
    );

export const removeApplication = (id: string) =>
    apiWrapper(
        () => client.removeApplication(id),
        () => {
            $application.removeOne(id);
            $component.enqueueSnackbar('移除成功', Status.success);
        },
    );

export const getResume = async (id: string, filename = 'resume') => {
    $component.setProgress(true);
    try {
        const { data, status } = await client.getResume(id, ({ loaded, total }) =>
            $component.setResumeProgress(loaded / total, id),
        );
        if (status >= 400) {
            throw JSON.parse(await data.text());
        }
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch ({ message, status = Status.error }) {
        $component.enqueueSnackbar(message as string, status as Status);
    }
    $component.setResumeProgress(0, id);
    $component.setProgress(false);
};

export const getAllRecruitments = async () => {
    const recruitments = await objectStorage.get('recruitments');
    const viewing = primitiveStorage.get('viewingId');
    if (recruitments) {
        $recruitment.setAll(recruitments);
    }
    return apiWrapper(
        () => client.getAllRecruitments(),
        (recruitments) => {
            $recruitment.setRecruitments(recruitments);
            $recruitment.setViewingRecruitment(viewing ?? recruitments.length ? recruitments[0].id : '');
            $component.enqueueSnackbar('成功获取招新信息', Status.success);
        },
    );
};

export const getOneRecruitment = async (rid: string) =>
    apiWrapper(
        () => client.getOneRecruitment(rid),
        (recruitment) => $recruitment.setRecruitment(recruitment),
    );

export const createRecruitment = (
    data: Pick<Recruitment, 'name' | 'beginning' | 'end' | 'deadline'> & { code: string },
) =>
    apiWrapper(
        () => client.createRecruitment(data),
        () => $component.enqueueSnackbar('已成功发起招新', Status.success),
    );

export const setRecruitmentSchedule = (rid: string, data: Pick<Recruitment, 'beginning' | 'end' | 'deadline'>) =>
    apiWrapper(
        () => client.setRecruitmentSchedule(rid, data),
        () => $component.enqueueSnackbar('已成功修改招新信息', Status.success),
    );

export const setRecruitmentInterviews = (
    rid: string,
    name: GroupOrTeam,
    interviews: Pick<Interview, 'date' | 'period' | 'slotNumber'>[],
) =>
    apiWrapper(
        () => client.setRecruitmentInterviews(rid, name, interviews),
        () => $component.enqueueSnackbar('已成功更新面试安排', Status.success),
    );

export const getVerifyCode = () =>
    apiWrapper(
        () => client.getCodeForMember(),
        () => $component.enqueueSnackbar('验证码已发送', Status.success),
    );

export const sendSMSToCandidate = (content: {
    type: SMSType;
    time?: string;
    place?: string;
    rest?: string;
    next: Step;
    aids: string[];
    code: string;
}) =>
    apiWrapper(
        () => client.sendSMSToCandidate(content),
        () => $component.enqueueSnackbar('已成功发送短信', Status.success),
    );

export const getMyGroup = async () => {
    const groupInfo = await objectStorage.get('group');
    if (groupInfo && !$member.firstLoad) {
        $member.setGroupInfo(groupInfo);
        return;
    }
    return apiWrapper(
        () => client.getGroupInfo(),
        (members) => $member.setGroupInfo(members),
    );
};

export const getMyInfo = async () => {
    const member = await objectStorage.get('member');
    if (member) {
        $member.setMyInfo(member);
        $application.setGroup(member.group);
        return;
    }
    return apiWrapper(
        () => client.getMemberInfo(),
        (member) => {
            $member.setMyInfo(member);
            $application.setGroup(member.group);
        },
    );
};

export const setMyInfo = (data: Pick<Member, 'mail' | 'phone' | 'password'>) =>
    apiWrapper(
        () => client.setMemberInfo(data),
        () => {
            $member.setMyInfo(data);
            $component.enqueueSnackbar('已成功修改信息', Status.success);
        },
    );

export const setGroupAdmin = (mids: string[]) =>
    apiWrapper(
        () => client.setGroupAdmin(mids),
        (mids) => {
            $member.setGroupAdmins(mids);
            $component.enqueueSnackbar('已成功设置管理员', Status.success);
        },
    );

export const loginByQRCode = () =>
    apiWrapper(
        () => client.getQRCode(),
        (url) => {
            void apiWrapper(
                () => {
                    $member.setQRCode(url);
                    $component.enqueueSnackbar('请尽快用企业微信扫描二维码', Status.success);
                    return client.authMemberByQRCode(new URL(url).searchParams.get('key')!);
                },
                (token) => {
                    $member.setToken(token);
                    $component.enqueueSnackbar('已成功登录', Status.success);
                },
                () => $member.setQRCode(''),
            );
            // Toggle progress bar off immediately when users are scanning QRCode
            $component.setProgress(false);
        },
    );

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.authMemberByPassword(phone, password),
        (token) => {
            $member.setToken(token);
            $component.enqueueSnackbar('已成功登录', Status.success);
        },
    );
