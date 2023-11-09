"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotLoggedIn = exports.Button = exports.VALID_PROVIDER_HINT = exports.VALID_RESPONSE_MODE = exports.VALID_RESPONSE_TYPE = exports.VALID_SCOPES = exports.VALID_IDENTITY_CLAIMS = exports.DEFAULT_PATH = exports.DEFAULT_RESPONSE_MODE = exports.DEFAULT_RESPONSE_TYPE = exports.DEFAULT_SCOPE = exports.PRODUCTION_WALLET = void 0;
exports.PRODUCTION_WALLET = 'https://wallet.hello.coop';
exports.DEFAULT_SCOPE = ['openid', 'name', 'email', 'picture'];
exports.DEFAULT_RESPONSE_TYPE = 'code';
exports.DEFAULT_RESPONSE_MODE = 'query';
exports.DEFAULT_PATH = '/authorize?';
exports.VALID_IDENTITY_CLAIMS = [
    'name',
    'nickname',
    'preferred_username',
    'given_name',
    'family_name',
    'email',
    'phone',
    'picture',
    // Hellō extensions -- non-standard claims
    'ethereum',
    'discord',
    'twitter',
    'github',
    'gitlab'
];
exports.VALID_SCOPES = [
    ...exports.VALID_IDENTITY_CLAIMS,
    'openid',
    // Hellō extensions -- non-standard scopes
    'profile_update',
];
exports.VALID_RESPONSE_TYPE = ['id_token', 'code']; // Default: 'code'
exports.VALID_RESPONSE_MODE = ['fragment', 'query', 'form_post']; // Default: 'query'
exports.VALID_PROVIDER_HINT = [
    // 'google' and 'email' are always in default
    // 'apple' added if on Apple OS
    // 'microsoft' added if on Microsoft OS
    'apple',
    'discord',
    'facebook',
    'github',
    'gitlab',
    'google',
    'twitch',
    'twitter',
    'tumblr',
    'mastodon',
    'microsoft',
    'line',
    'wordpress',
    'yahoo',
    'phone',
    'ethereum',
    'qrcode',
    // the following will remove provider from recommended list
    'apple--',
    'microsoft--',
    'google--',
    'email--',
    'passkey--',
];
const CLASS_MAPPING = {
    black: {
        "ignore-light": "",
        "ignore-dark": "hello-btn-black-on-dark",
        "aware-invert": "hello-btn-black-and-invert",
        "aware-static": "hello-btn-black-and-static"
    },
    white: {
        "ignore-light": "hello-btn-white-on-light",
        "ignore-dark": "hello-btn-white-on-dark",
        "aware-invert": "hello-btn-white-and-invert",
        "aware-static": "hello-btn-white-and-static"
    },
};
var Button;
(function (Button) {
    Button.STYLES_URL = 'https://cdn.hello.coop/css/hello-btn.css';
    Button.HOVER_MAPPING = {
        "pop": "",
        "glow": "hello-btn-hover-glow",
        "flare": "hello-btn-hover-flare",
        "none": "hello-btn-hover-none"
    };
    Button.CLASS_MAPPING = {
        black: {
            "ignore-light": "",
            "ignore-dark": "hello-btn-black-on-dark",
            "aware-invert": "hello-btn-black-and-invert",
            "aware-static": "hello-btn-black-and-static"
        },
        white: {
            "ignore-light": "hello-btn-white-on-light",
            "ignore-dark": "hello-btn-white-on-dark",
            "aware-invert": "hello-btn-white-and-invert",
            "aware-static": "hello-btn-white-and-static"
        },
    };
})(Button || (exports.Button = Button = {}));
exports.NotLoggedIn = { isLoggedIn: false };
