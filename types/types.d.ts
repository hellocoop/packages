export declare const PRODUCTION_WALLET: string;
export declare const DEFAULT_SCOPE: Scope[];
export declare const DEFAULT_RESPONSE_TYPE: AuthResponseType;
export declare const DEFAULT_RESPONSE_MODE: AuthResponseMode;
export declare const DEFAULT_PATH: string;
export declare const VALID_IDENTITY_CLAIMS: readonly ["name", "nickname", "preferred_username", "given_name", "family_name", "email", "phone", "picture", "ethereum", "discord", "twitter", "github", "gitlab"];
export declare const VALID_SCOPES: readonly ["name", "nickname", "preferred_username", "given_name", "family_name", "email", "phone", "picture", "ethereum", "discord", "twitter", "github", "gitlab", "openid", "profile_update"];
export declare const VALID_RESPONSE_TYPE: readonly ["id_token", "code"];
export declare const VALID_RESPONSE_MODE: string[];
export declare const VALID_PROVIDER_HINT: readonly ["apple", "discord", "facebook", "github", "gitlab", "google", "twitch", "twitter", "tumblr", "mastodon", "microsoft", "line", "wordpress", "yahoo", "phone", "ethereum", "qrcode", "apple--", "microsoft--", "google--", "email--", "passkey--"];
export type Scope = typeof VALID_SCOPES[number];
export type AuthResponseType = typeof VALID_RESPONSE_TYPE[number];
export type AuthResponseMode = typeof VALID_RESPONSE_MODE[number];
export type ProviderHint = typeof VALID_PROVIDER_HINT[number];
type IdentityClaims = typeof VALID_IDENTITY_CLAIMS[number];
type OptionalClaims = {
    [K in IdentityClaims]?: unknown;
};
export type Claims = OptionalClaims & {
    sub: string;
};
type AuthCookie = {
    sub: string;
    iat: number;
} & Claims & {
    [key: string]: any;
};
export type Auth = {
    isLoggedIn: false;
} | ({
    isLoggedIn: true;
} & AuthCookie);
export type TokenPayload = OptionalClaims & {
    iss: string;
    aud: string;
    nonce: string;
    jti: string;
    sub: string;
    scope: string[];
    iat: number;
    exp: number;
};
export type TokenHeader = {
    typ: string;
    alg: string;
};
export declare namespace Button {
    type Color = "black" | "white";
    type Theme = "ignore-light" | "ignore-dark" | "aware-invert" | "aware-static";
    type Hover = "pop" | "glow" | "flare" | "none";
    type UpdateScope = "email" | "picture" | "twitter" | "discord" | "github" | "gitlab";
    const STYLES_URL = "https://cdn.hello.coop/css/hello-btn.css";
    const HOVER_MAPPING: {
        pop: string;
        glow: string;
        flare: string;
        none: string;
    };
    const CLASS_MAPPING: {
        black: {
            "ignore-light": string;
            "ignore-dark": string;
            "aware-invert": string;
            "aware-static": string;
        };
        white: {
            "ignore-light": string;
            "ignore-dark": string;
            "aware-invert": string;
            "aware-static": string;
        };
    };
}
export {};
//# sourceMappingURL=types.d.ts.map