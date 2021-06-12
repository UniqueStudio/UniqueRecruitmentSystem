import { Color } from '@material-ui/lab';
import { makeAutoObservable } from 'mobx';

import { Evaluation, Step } from '@config/enums';
import { primitiveStorage } from '@utils/storage';

interface Snackbar {
    message: string;
    variant: Color;
}

export class ComponentStateStore {
    progressNumber = 0;

    drawerOpen = false;

    suggestionOpen = false;

    messengerOpen = false;

    recruitmentPanelOpen = false;

    snackbars: Record<string, Snackbar> = {};

    fabOn = Step.报名;

    resumeProgresses: Record<string, number> = {};

    darkMode = primitiveStorage.get('darkMode');

    inputtingComment = {
        content: '',
        evaluation: Evaluation.fair,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setProgress(on: boolean) {
        if (on) {
            this.progressNumber++;
        } else {
            this.progressNumber = Math.max(0, this.progressNumber - 1);
        }
    }

    get progressOn() {
        return !!this.progressNumber;
    }

    toggleSuggestion() {
        this.suggestionOpen = !this.suggestionOpen;
    }

    toggleMessenger() {
        this.messengerOpen = !this.messengerOpen;
    }

    toggleRecruitmentPanel() {
        this.recruitmentPanelOpen = !this.recruitmentPanelOpen;
    }

    toggleDrawer(open?: boolean) {
        this.drawerOpen = open ?? !this.drawerOpen;
    }

    enqueueSnackbar(message: string, variant: Color) {
        this.snackbars[performance.now()] = {
            message,
            variant,
        };
    }

    removeSnackbar(key: string) {
        delete this.snackbars[key];
    }

    setFabOn(step: Step) {
        this.fabOn = step;
    }

    setDarkMode(darkMode?: boolean) {
        this.darkMode = darkMode;
        if (darkMode === undefined) {
            primitiveStorage.del('darkMode');
        } else {
            primitiveStorage.set('darkMode', darkMode);
        }
    }

    setResumeProgress(progress: number, owner: string) {
        this.resumeProgresses[owner] = progress;
    }

    recordInputtingComment(evaluation: Evaluation, content: string) {
        this.inputtingComment.evaluation = evaluation;
        this.inputtingComment.content = content;
    }
}
