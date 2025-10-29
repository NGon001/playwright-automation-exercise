import { apiTest as test, Methods, Status,  userFoundMessage, userNotFoundMessage, userCreatedMessage, userDeletedMessage, accountNotFoundMessage, badRequestMessage, badRequestParameterMessage, notSupportedReqMethodMessage, emailAlreadyExistsMessage, methodNotAllowedMessage} from '../../Helper/base.ts';
import { generateRandomEmail } from '../../Helper/tools.js';

test.describe("API Authorization tests", () => {
    test('C8 POST (/api/verifyLogin) User exists with valid credentials', async({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.success,userFoundMessage, process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
    });

    test('C4 POST (/api/verifyLogin) User does not exist (valid format but not registered)', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,(await generateRandomEmail()),process.env.REGISTER_PASSWORD);
    });

    test('C1 POST (/api/verifyLogin) Invalid email format', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"invalid-email",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C3 POST (/api/verifyLogin) Empty email field', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C5 POST (/api/verifyLogin) Empty password field', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL,"");
    });  

    test('C2 POST (/api/verifyLogin) Both email and password missing', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,"","");
    });

    test('C7 POST (/api/verifyLogin) Case sensitivity check email', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL.toUpperCase(),process.env.VALID_LOGIN_PASSWORD);
    });

    test('C10 POST (/api/verifyLogin) Case sensitivity check password', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD.toUpperCase());
    });

    test('C9 POST (/api/verifyLogin) SQL Injection in email', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL + "' OR '1'='1",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C6 POST (/api/verifyLogin) SQL Injection in password', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD + "' OR '1'='1");
    });

    test('C11 POST (/api/verifyLogin) Very long input fields', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.notFound,userNotFoundMessage,process.env.VALID_LOGIN_EMAIL.repeat(400),process.env.VALID_LOGIN_PASSWORD.repeat(400));
    });

    test('C12 POST (/api/verifyLogin) No email key', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.badReq,badRequestMessage(Methods.POST),undefined,process.env.VALID_LOGIN_PASSWORD);
    });

    test('C13 POST (/api/verifyLogin) No password key', async ({ authorizationAPI }) => {
        await authorizationAPI.verifyLogin(Methods.POST,Status.badReq,badRequestMessage(Methods.POST),process.env.VALID_LOGIN_EMAIL,undefined);
    });

    test('C18 GET, PUT, DELETE (/api/verifyLogin) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            await authorizationAPI.verifyLogin(method,Status.methodNotAllowed,notSupportedReqMethodMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
        }
    });
    test('C15 POST (/api/createAccount) Successful registration with valid data', async ({ authorizationAPI }) => {
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
            Methods.POST,
            Status.resourceCreated,
            userCreatedMessage,
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
        await authorizationAPI.deleteAccount(Methods.DELETE,email,process.env.REGISTER_PASSWORD,Status.success,userDeletedMessage);
    });

    test('C16 POST (/api/createAccount) Bad req registration with only email and password', async ({ authorizationAPI }) => {
        const email = await generateRandomEmail();
        await authorizationAPI.createAccount(
             Methods.POST,
             Status.badReq,
             badRequestParameterMessage(Methods.POST,"name"),
             undefined,
             email,
             process.env.REGISTER_PASSWORD
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
        await authorizationAPI.deleteAccount(Methods.DELETE,email,process.env.REGISTER_PASSWORD,Status.success,userDeletedMessage);
    });

    test('C19 POST (/api/createAccount) Duplicate email registration', async ({ authorizationAPI }) => {
        await authorizationAPI.createAccount(
             Methods.POST,
             Status.badReq,
             emailAlreadyExistsMessage,
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

    test('C14 GET, PUT, DELETE (/api/createAccount) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            const email = await generateRandomEmail();
            await authorizationAPI.createAccount(
                method,
                Status.methodNotAllowed,
                methodNotAllowedMessage(method),
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
        }
    });

    test('C20 GET (/api/getUserDetailByEmail) Valid request with existing user email', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL,Status.success);
    });

    test('C21 GET (/api/getUserDetailByEmail) Valid request with not existing user email', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,(process.env.VALID_LOGIN_EMAIL + "1"),Status.notFound,accountNotFoundMessage);
    });

    test('C23 GET (/api/getUserDetailByEmail) Case-insensitive email match', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL.toUpperCase(),Status.notFound,accountNotFoundMessage);
    });

    test('C22 GET (/api/getUserDetailByEmail) Missing email parameter', async ({ authorizationAPI }) => {
        await authorizationAPI.getUserDetailByEmail(Methods.GET,undefined,Status.badReq,badRequestParameterMessage(Methods.GET,"email"));
    });

    test('C24 POST, PUT, DELETE (/api/getUserDetailByEmail) Incorrect req method', async ({ authorizationAPI }) => {
        for (const method of Object.values(Methods)) {
            if (method === 'GET') continue; // skip POST (correct req method)
            await authorizationAPI.getUserDetailByEmail(method,process.env.VALID_LOGIN_EMAIL,Status.methodNotAllowed,notSupportedReqMethodMessage)
        }
    });
});