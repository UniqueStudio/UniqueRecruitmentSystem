import { makeAutoObservable } from 'mobx';
import { OptionsObject, SnackbarKey, SnackbarMessage, VariantType } from 'notistack';
import { Evaluation } from '../config/types';

interface Snackbar {
    message: SnackbarMessage;
    options: OptionsObject;
}

export class ComponentStateStore {
    progressOn = false;
    drawerOpen = false;
    snackbars: Record<SnackbarKey, Snackbar> = {};
    fabOn = -1;
    resume = {
        progress: 0,
        cid: '',
    };
    inputtingComment = {
        content: '',
        evaluation: 2 as Evaluation,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setProgress(on: boolean) {
        this.progressOn = on;
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

    resumeProgress(progress: number, cid: string) {
        this.resume.progress = progress;
        this.resume.cid = cid;
    }

    recordInputtingComment(evaluation: Evaluation, content: string) {
        this.inputtingComment.evaluation = evaluation;
        this.inputtingComment.content = content;
    }
}
