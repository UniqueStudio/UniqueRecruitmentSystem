export const Msg = {
    $$ONLY_MONEY_MATTERS$$: "NO HE DOESN'T",

    $_INVALID: (name: string) => `Invalid ${name}`,
    $_NO_PERMISSION: (action: string) => `You don't have the permission to ${action}`,
    $_FAILED: (action: string) => `Failed to ${action}`,
    $_AGAIN: (failure: string) => `${failure}, please try again`,
    $_OOPS: (failure: string) => `Oops, ${failure}`,

    R_NOT_STARTED: (name: string) => `Recruitment ${name} has not started yet`,
    R_ENDED: (name: string) => `Recruitment ${name} has already ended`,
    // eslint-disable-next-line max-len
    R_ENDED_LONG: (name: string) => `Recruitment ${name} has already ended, hence you cannot modify it. If you REALLY want to extend the end date of this recruitment, please contact maintainers. This is not a bug.`,
    R_STOPPED: (name: string) => `The application deadline of recruitment ${name} has already passed`,
    R_NO_PERMISSION: (action: string) => Msg.$_NO_PERMISSION(`${action} this recruitment`),
    R_NO_INTERVIEWS: (group: string) => `No interviews are scheduled for ${group}`,
    R_INTERVIEWS_CROSS_GROUP: (group: string) => `You cannot update interviews for group ${group}`,
    R_INTERVIEWS_SELECTED: 'Some of the interview slots are already selected by candidates',

    A_REQUIRE_RESUME: (name: string) => `You cannot apply to group ${name} without submitting resume`,
    A_ABANDONED: (name: string) => `Application has already been abandoned by ${name}`,
    A_REJECTED: (name: string) => `Application of ${name} has already been rejected`,
    A_MOVED: (name: string) => `Application of ${name} has been moved by others`,
    A_NO_PERMISSION: (action: string) => Msg.$_NO_PERMISSION(`${action} this application`),
    A_CROSS_GROUP: (group: string) => `You don't have the permission to modify applications of group ${group}`,
    A_WRONG_STEP: (action: string, step: string) => `You cannot ${action} applications in step ${step}`,
    A_NO_RESUME: (name: string) => `Resume of application of ${name} doesn't exist`,

    M_HAS_OTHERS: 'Not all of the requested members are in the group',
};
