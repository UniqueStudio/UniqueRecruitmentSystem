import { makeAutoObservable } from 'mobx';
import { OptionsObject, SnackbarKey, SnackbarMessage, VariantType } from 'notistack';

import { Evaluation } from '@config/enums';

interface Snackbar {
    message: SnackbarMessage;
    options: OptionsObject;
}

export class ComponentStateStore {
    progressNumber = 0;

    drawerOpen = false;

    suggestionOpen = false;

    messengerOpen = false;

    recruitmentPanelOpen = false;

    snackbars: Record<SnackbarKey, Snackbar> = {};

    fabOn = -1;

    resumeProgresses: Record<string, number> = {};

    darkMode?: boolean = undefined;

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

    toggleDrawer() {
        this.drawerOpen = !this.drawerOpen;
    }

    enqueueSnackbar(message: SnackbarMessage, variant: VariantType) {
        this.snackbars[performance.now()] = {
            message,
            options: {
                variant,
            },
        };
    }

    removeSnackbar(key: SnackbarKey) {
        delete this.snackbars[key];
    }

    toggleFabOn(step: number) {
        this.fabOn = step;
    }

    toggleFabOff() {
        this.fabOn = -1;
    }

    setDarkMode(darkMode?: boolean) {
        this.darkMode = darkMode;
    }

    setResumeProgress(progress: number, cid: string) {
        this.resumeProgresses[cid] = progress;
    }

    recordInputtingComment(evaluation: Evaluation, content: string) {
        this.inputtingComment.evaluation = evaluation;
        this.inputtingComment.content = content;
    }
}
