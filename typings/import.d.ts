interface ImportMeta {
    url: string;
    readonly hot?: {
        data: unknown;
        accept(
            callback?: (update: {
                module: unknown;
            }) => void,
        ): void;
        accept(
            dependencies: readonly string[],
            callback: (update: {
                module: unknown;
                deps: unknown[];
            }) => void,
        ): void;
        dispose(callback: () => void): void;
        invalidate(): void;
        decline(): void;
    };
    readonly env: {
        readonly [key: string]: string;
    } & {
        readonly MODE: string;
        readonly NODE_ENV: string;
        readonly SSR?: boolean;
    };
}
