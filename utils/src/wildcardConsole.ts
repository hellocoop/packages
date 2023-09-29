export interface WildCard {
    uri: string,
    targetURI: string,
    appName: string,
    redirectURI: string
}
export function wildcardConsole( { uri, targetURI, appName, redirectURI}: WildCard ) {
    return `
        <html>
            <head>
                TBD
            </head>
        </html>
    `
}