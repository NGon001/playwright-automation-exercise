import { apiTest as test, Methods, Status,  userFoundMessage, userNotFoundMessage, userCreatedMessage, userDeletedMessage, accountNotFoundMessage, badRequestMessage, badRequestParameterMessage, notSupportedReqMethodMessage, emailAlreadyExistsMessage, methodNotAllowedMessage} from '../../Helper/base.ts';
import { generateRandomEmail, getEnv } from '../../Helper/tools.js';

test.describe("API Authorization tests", () => {
    test('C8 POST (/api/verifyLogin) User exists with valid credentials', async({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.success,userFoundMessage, await getEnv("VALID_LOGIN_EMAIL"),await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C4 POST (/api/verifyLogin) User does not exist (valid format but not registered)', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,(await generateRandomEmail()),await getEnv("REGISTER_PASSWORD"));
    });

    test('C1 POST (/api/verifyLogin) Invalid email format', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"invalid-email",await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C3 POST (/api/verifyLogin) Empty email field', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"",await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C5 POST (/api/verifyLogin) Empty password field', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,await getEnv("VALID_LOGIN_EMAIL"),"");
    });  

    test('C2 POST (/api/verifyLogin) Both email and password missing', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"","");
    });

    test('C7 POST (/api/verifyLogin) Case sensitivity check email', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,(await getEnv("VALID_LOGIN_EMAIL")).toUpperCase(),await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C10 POST (/api/verifyLogin) Case sensitivity check password', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,await getEnv("VALID_LOGIN_EMAIL"),(await getEnv("VALID_LOGIN_PASSWORD")).toUpperCase());
    });

    test('C9 POST (/api/verifyLogin) SQL Injection in email', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,await getEnv("VALID_LOGIN_EMAIL") + "' OR '1'='1",await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C6 POST (/api/verifyLogin) SQL Injection in password', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,await getEnv("VALID_LOGIN_EMAIL"),await getEnv("VALID_LOGIN_PASSWORD") + "' OR '1'='1");
    });

    test('C11 POST (/api/verifyLogin) Very long input fields', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,(await getEnv("VALID_LOGIN_EMAIL")).repeat(400),(await getEnv("VALID_LOGIN_PASSWORD")).repeat(400));
    });

    test('C12 POST (/api/verifyLogin) No email key', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.badReq,badRequestMessage(Methods.POST),undefined,await getEnv("VALID_LOGIN_PASSWORD"));
    });

    test('C13 POST (/api/verifyLogin) No password key', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.badReq,badRequestMessage(Methods.POST),await getEnv("VALID_LOGIN_EMAIL"),undefined);
    });

    test('C18 GET, PUT, DELETE (/api/verifyLogin) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            await authorizationAPI.verifyLogin(method,Status.methodNotAllowed,notSupportedReqMethodMessage,await getEnv("VALID_LOGIN_EMAIL"),await getEnv("VALID_LOGIN_PASSWORD"));
        }
    });
    test('C15 POST (/api/createAccount) Successful registration with valid data', async ({ authorizationAPI }) => {
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
            Methods.POST,
            Status.resourceCreated,
            userCreatedMessage,
            `${await getEnv("REGISTER_NAME_FIRST")} ${await getEnv("REGISTER_NAME_LAST")}`,
            email,
            await getEnv("REGISTER_PASSWORD"),
            await getEnv("REGISTER_TITLE"),
            await getEnv("REGISTER_BIRTH_DAY"),
            await getEnv("REGISTER_BIRTH_MONTH"),
            await getEnv("REGISTER_BIRTH_YEAR"),
            await getEnv("REGISTER_NAME_FIRST"),
            await getEnv("REGISTER_NAME_LAST"),
            await getEnv("REGISTER_COMPANY_NAME"),
            await getEnv("REGISTER_ADDRESS"),
            await getEnv("REGISTER_ADDRESS2"),
            await getEnv("REGISTER_COUNTRY"),
            await getEnv("REGISTER_ZIPCODE"),
            await getEnv("REGISTER_STATE"),
            await getEnv("REGISTER_CITY"),
            await getEnv("REGISTER_MOBILE_NUMBER")
        );

        //Delete account
        await authorizationAPI.deleteAccount(Methods.DELETE,email,await getEnv("REGISTER_PASSWORD"),Status.success,userDeletedMessage);
    });

    test('C16 POST (/api/createAccount) Bad req registration with only email and password', async ({ authorizationAPI }) => {
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
             Methods.POST,
             Status.badReq,
             badRequestParameterMessage(Methods.POST,"name"),
             undefined,
             email,
             await getEnv("REGISTER_PASSWORD")
        );
    });

    test('C17 POST (/api/createAccount) Success registration with only email and password', async ({ authorizationAPI }) => {
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
             Methods.POST,
             Status.resourceCreated,
             userCreatedMessage,
             "",
             email,
             await getEnv("REGISTER_PASSWORD"),
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
        await authorizationAPI.deleteAccount(Methods.DELETE,email,await getEnv("REGISTER_PASSWORD"),Status.success,userDeletedMessage);
    });

    test('C19 POST (/api/createAccount) Duplicate email registration', async ({ authorizationAPI }) => {
        await authorizationAPI.createAccount(
             Methods.POST,
             Status.badReq,
             emailAlreadyExistsMessage,
             "",
             await getEnv("VALID_LOGIN_EMAIL"),
             await getEnv("REGISTER_PASSWORD"),
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

    test('C14 GET, PUT, DELETE (/api/createAccount) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            const email = await generateRandomEmail();
            await authorizationAPI.createAccount(
                method,
                Status.methodNotAllowed,
                methodNotAllowedMessage(method),
                `${await getEnv("REGISTER_NAME_FIRST")} ${await getEnv("REGISTER_NAME_LAST")}`,
                email,
                await getEnv("REGISTER_PASSWORD"),
                await getEnv("REGISTER_TITLE"),
                await getEnv("REGISTER_BIRTH_DAY"),
                await getEnv("REGISTER_BIRTH_MONTH"),
                await getEnv("REGISTER_BIRTH_YEAR"),
                await getEnv("REGISTER_NAME_FIRST"),
                await getEnv("REGISTER_NAME_LAST"),
                await getEnv("REGISTER_COMPANY_NAME"),
                await getEnv("REGISTER_ADDRESS"),
                await getEnv("REGISTER_ADDRESS2"),
                await getEnv("REGISTER_COUNTRY"),
                await getEnv("REGISTER_ZIPCODE"),
                await getEnv("REGISTER_STATE"),
                await getEnv("REGISTER_CITY"),
                await getEnv("REGISTER_MOBILE_NUMBER")
            );
        }
    });

    test('C20 GET (/api/getUserDetailByEmail) Valid request with existing user email', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,await getEnv("VALID_LOGIN_EMAIL"),Status.success);
    });

    test('C21 GET (/api/getUserDetailByEmail) Valid request with not existing user email', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,(await getEnv("VALID_LOGIN_EMAIL") + "1"),Status.notFound,accountNotFoundMessage);
    });

    test('C23 GET (/api/getUserDetailByEmail) Case-insensitive email match', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,(await getEnv("VALID_LOGIN_EMAIL")).toUpperCase(),Status.notFound,accountNotFoundMessage);
    });

    test('C22 GET (/api/getUserDetailByEmail) Missing email parameter', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,undefined,Status.badReq,badRequestParameterMessage(Methods.GET,"email"));
    });

    test('C24 POST, PUT, DELETE (/api/getUserDetailByEmail) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'GET') continue; // skip POST (correct req method)
            await authorizationAPI.getUserDetailByEmail(method,await getEnv("VALID_LOGIN_EMAIL"),Status.methodNotAllowed,notSupportedReqMethodMessage)
        }
    });
});