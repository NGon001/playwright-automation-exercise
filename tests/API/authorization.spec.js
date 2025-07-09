import { apiTest as test, Methods, Status  } from '../../Helper/base.ts';
import { generateRandomEmail, verifyResponseCode } from '../../Helper/tools.js';

test.describe("API Authorization tests", () => {
    test('POST (/api/verifyLogin) User exists with valid credentials', async({ authorizationAPI }) => {
        const expectedCode = Status.success;
        const expectedMessage = "User exists!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) User does not exist (valid format but not registered)', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,(await generateRandomEmail()),process.env.REGISTER_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Invalid email format', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,"invalid-email",process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Empty email field', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,"",process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Empty password field', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL,"");
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });  

    test('POST (/api/verifyLogin) Both email and password missing', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,"","");
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Case sensitivity check email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL.toUpperCase(),process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Case sensitivity check password', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD.toUpperCase());
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) SQL Injection in email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL + "' OR '1'='1",process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) SQL Injection in password', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD + "' OR '1'='1");
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) Very long input fields', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL.repeat(400),process.env.VALID_LOGIN_PASSWORD.repeat(400));
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) No email key', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,undefined,process.env.VALID_LOGIN_PASSWORD);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('POST (/api/verifyLogin) No password key', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        const response = await authorizationAPI.POST_verifyLogin(Methods.POST,process.env.VALID_LOGIN_EMAIL,undefined);
        await verifyResponseCode(response,expectedCode);
        await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
    });

    test('GET, PUT, DELETE (/api/verifyLogin) Incorrect req method', async ({ authorizationAPI }) => {
        const expectedCode = Status.methodNotAllowed;
        const expectedMessage = "This request method is not supported.";

        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            const response = await authorizationAPI.POST_verifyLogin(method,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
            await verifyResponseCode(response,expectedCode);
            await authorizationAPI.verifyLoginAPISchema(response,expectedCode,expectedMessage);
        }
    });
    test('POST (/api/createAccount) Successful registration with valid data', async ({ authorizationAPI }) => {
        const expectedCode = Status.resourceCreated;
        const expectedMessage = "User created!";
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
            Methods.POST,
            expectedCode,
            expectedMessage,
            `${process.env.REGISTER_NAME_FIRST} ${process.env.REGISTER_NAME_LAST}`,
            email,
            process.env.REGISTER_PASSWORD,
            process.env.REGISTER_TITLE,
            process.env.REGISTER_BIRTH_DAY,
            process.env.REGISTER_BIRTH_MONTH,
            process.env.REGISTER_BIRTH_YEAR,
            process.env.REGISTER_NAME_FIRST,
            process.env.REGISTER_NAME_LAST,
            process.env.REGISTER_COMPANY_NAME,
            process.env.REGISTER_ADDRESS,
            process.env.REGISTER_ADDRESS2,
            process.env.REGISTER_COUNTRY,
            process.env.REGISTER_ZIPCODE,
            process.env.REGISTER_STATE,
            process.env.REGISTER_CITY,
            process.env.REGISTER_MOBILE_NUMBER
        );

        //Delete account
        const deleteExpectedCode = Status.success;
        const deleteExpectedMessage = "Account deleted!";
        await authorizationAPI.deleteAccount(Methods.DELETE,email,process.env.REGISTER_PASSWORD,deleteExpectedCode,deleteExpectedMessage);
    });

    test('POST (/api/createAccount) Bad req registration with only email and password', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, name parameter is missing in POST request.";
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
             Methods.POST,
             expectedCode,
             expectedMessage,
             undefined,
             email,
             process.env.REGISTER_PASSWORD
        );
    });

    test('POST (/api/createAccount) Success registration with only email and password', async ({ authorizationAPI }) => {
        const expectedCode = Status.resourceCreated;
        const expectedMessage = "User created!";
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
             Methods.POST,
             expectedCode,
             expectedMessage,
             "",
             email,
             process.env.REGISTER_PASSWORD,
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             ""
        );

        //Delete account
        const deleteExpectedCode = Status.success;
        const deleteExpectedMessage = "Account deleted!";
        await authorizationAPI.deleteAccount(Methods.DELETE,email,process.env.REGISTER_PASSWORD,deleteExpectedCode,deleteExpectedMessage);
    });

    test('POST (/api/createAccount) Duplicate email registration', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Email already exists!";
        await authorizationAPI.createAccount(
             Methods.POST,
             expectedCode,
             expectedMessage,
             "",
             process.env.VALID_LOGIN_EMAIL,
             process.env.REGISTER_PASSWORD,
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             "",
             ""
        );
    });

    test('GET (/api/getUserDetailByEmail) Valid request with existing user email', async ({ authorizationAPI }) => {
        const expectedCode = Status.success;
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL,expectedCode);
    });

    test('GET (/api/getUserDetailByEmail) Valid request with not existing user email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "Account not found with this email, try another email!";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,(process.env.VALID_LOGIN_EMAIL + "1"),expectedCode,expectedMessage);
    });

    test('GET (/api/getUserDetailByEmail) Case-insensitive email match', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "Account not found with this email, try another email!";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL.toUpperCase(),expectedCode,expectedMessage);
    });

    test('GET (/api/getUserDetailByEmail) Missing email parameter', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email parameter is missing in GET request.";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,undefined,expectedCode,expectedMessage);
    });
});