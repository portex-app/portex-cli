declare interface ReqLoginFrom {
    login: string,
    password: string
}


declare interface ResLogin {
    token: string
}

declare interface Platform {
    created_at: number;
    id: string,
    name: string,
}

declare interface ResPlatform {
    platforms: Array<Platform>
}