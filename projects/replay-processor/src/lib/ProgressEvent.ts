

export interface IProgress {
    name: string;
    description: string;
    loaded: number;
    total: number;
}

export interface IProgressEvent {
    currentStep:IProgress;
    overall:IProgress;
}