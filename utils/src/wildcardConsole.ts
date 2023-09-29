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
            </head>
            <body>
                The following Redirect URI is not configured for <b/>
                    ${appName}<b/>
                    ${redirectURI}<b/>
                <a href="${uri}">Add to Redirect URIs</> or <a href="${targetURI}">Do this later.</>
            </body>
        </html>
    `
}