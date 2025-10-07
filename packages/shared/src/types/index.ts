export interface UaSupportInfo {
    subtitles: number;
    full_audio: number;
}

export interface GameWithUa {
    name: string;
    supports: UaSupportInfo;
}

export interface UAdata {
    all: number;
    ua: Array<GameWithUa>;
    ratio: number;
    withFull: number;
    withSubs: number;
}

export interface GamesWithUA {
    games: UAdata;
}
