

const APP_HOME = 'http://127.0.0.1:3000/'
const APP_API = APP_HOME+'api/hellocoop'

import { test, expect } from '@playwright/test';

const loggedOut = {isLoggedIn:false}
const loggedIn = {
    isLoggedIn:true,
    sub:"00000000-0000-0000-0000-00000000",
    name:"John Smith",
    email:"john.smith@example.com",
    picture:"https://pictures.hello.coop/mock/portrait-of-john-smith.jpeg",
    email_verified:true
}



/* 
* used for debugging
*
const trace = (page) => {
    page.on('request', async request => {
        console.log('Request:', request.method(), request.url());
        console.log('\theaders:', request.headers());
      });
      
    page.on('response', async response => {
        console.log('Response:', response.status(), response.url());
        console.log('\tresponse headers:', response.headers());
    });
    
    page.on('requestfailed', request => {
        console.log('Request failed:', request.method(), request.url(), request?.failure()?.errorText);
        console.log('\theaders:', request.headers());
    });
}
*/

test.describe(`Testing ${APP_HOME}`, () => {

    test.beforeEach(async ({ page }) => {        
        await page.goto(APP_API+'?op=logout')
        const response = await page.request.get(APP_API+'?op=auth')
        const json = await response.json()
        expect(json).toEqual(loggedOut)
    })

    test('Logged Out', async ({ page }) => {
        const response = await page.request.get(APP_HOME);
        const json = await response.json()
        expect(json).toEqual(loggedOut)
    })
    test('login', async ({ page }) => {
        // this request fails in webkit -- and cookies are not set
        // TBD - figure out why so we can test webkit
        await page.goto(APP_API+'?op=login')
        const body = await page.textContent('body');
        try {
            const json = JSON.parse(body as string);
            delete json.iat
            expect(json).toEqual(loggedIn)
        }
        catch (e) {
            expect(e).toBeNull()
        }
    })
    test('Logged In', async ({ page }) => {
        await page.goto(APP_API+'?op=login')
        const response = await page.request.get(APP_HOME);
        const json = await response.json()
        delete json.iat
        expect(json).toEqual(loggedIn)
    })
    test('auth', async ({ page }) => {
        await page.goto(APP_API+'?op=login')
        const response = await page.request.get(APP_API+'?op=auth');
        const json = await response.json()
        delete json.iat
        expect(json).toEqual(loggedIn)
    })
    test('login_hint', async ({ page }) => {
        await page.goto(APP_API+'?op=login')
        const loginHintParam = 'mailto:john.smith@me.com'
        const response = await page.request.get(APP_API+'?op=login&login_hint=' + loginHintParam, {
            maxRedirects: 0 //verify whether login_hint is included in authz request to mockin server
        })
        const authzReqUrl = new URL(response.headers().location) 
        const authzReqUrlParams = new URLSearchParams(authzReqUrl.search)
        console.log(authzReqUrlParams.get('login_hint'))
        expect(authzReqUrlParams.get('login_hint')).toEqual(loginHintParam)
    })
    test('provider inititated login', async ({ page }) => {

    })
    test('invite', async ({ page }) => {
        
    })
});
