export class SteamApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
    ) {
        super(message);
        this.name = 'SteamApiError';
    }
}

export class SteamValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SteamValidationError';
    }
}

export class SteamUserNotFoundError extends Error {
    constructor(
        username: string,
        public response?: unknown,
    ) {
        super(`Steam user '${username}' not found`);
        this.name = 'SteamUserNotFoundError';
    }
}
