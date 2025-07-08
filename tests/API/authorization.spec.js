import { apiTest as test  } from '../../Helper/base.ts';
import { generateRandomEmail } from '../../Helper/tools.js';

test.describe("API Authorization tests", () => {
    test('POST (/api/verifyLogin) User exists with valid credentials', async({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.success;
        const expectedMessage = "User exists!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) User does not exist (valid format but not registered)', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin((await generateRandomEmail()),process.env.REGISTER_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Invalid email format', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin("invalid-email",process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Empty email field', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin("",process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Empty password field', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL,"");
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });  

    test('POST (/api/verifyLogin) Both email and password missing', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin("","");
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Case sensitivity check email', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL.toUpperCase(),process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Case sensitivity check password', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD.toUpperCase());
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) SQL Injection in email', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL + "' OR '1'='1",process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) SQL Injection in password', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD + "' OR '1'='1");
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Very long input fields', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL.repeat(400),process.env.VALID_LOGIN_PASSWORD.repeat(400));
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) No email key', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        const response = await authorizationAPI.POST_verifyLogin(undefined,process.env.VALID_LOGIN_PASSWORD);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) No password key', async ({ authorizationAPI }) => {
        const expectedCode = authorizationAPI.Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        const response = await authorizationAPI.POST_verifyLogin(process.env.VALID_LOGIN_EMAIL,undefined);
        await authorizationAPI.verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });
});