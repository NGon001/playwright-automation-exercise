import { apiTest as test, Methods, Status  } from '../../Helper/base.ts';
import { generateRandomEmail } from '../../Helper/tools.js';

test.describe("API Authorization tests", () => {
    test('C8 POST (/api/verifyLogin) User exists with valid credentials', async({ authorizationAPI }) => {
        const expectedCode = Status.success;
        const expectedMessage = "User exists!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage, process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
    });

    test('C4 POST (/api/verifyLogin) User does not exist (valid format but not registered)', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,(await generateRandomEmail()),process.env.REGISTER_PASSWORD);
    });

    test('C1 POST (/api/verifyLogin) Invalid email format', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,"invalid-email",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C3 POST (/api/verifyLogin) Empty email field', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,"",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C5 POST (/api/verifyLogin) Empty password field', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL,"");
    });  

    test('C2 POST (/api/verifyLogin) Both email and password missing', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,"","");
    });

    test('C7 POST (/api/verifyLogin) Case sensitivity check email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL.toUpperCase(),process.env.VALID_LOGIN_PASSWORD);
    });

    test('C10 POST (/api/verifyLogin) Case sensitivity check password', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD.toUpperCase());
    });

    test('C9 POST (/api/verifyLogin) SQL Injection in email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL + "' OR '1'='1",process.env.VALID_LOGIN_PASSWORD);
    });

    test('C6 POST (/api/verifyLogin) SQL Injection in password', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD + "' OR '1'='1");
    });

    test('C11 POST (/api/verifyLogin) Very long input fields', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "User not found!";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL.repeat(400),process.env.VALID_LOGIN_PASSWORD.repeat(400));
    });

    test('C12 POST (/api/verifyLogin) No email key', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,undefined,process.env.VALID_LOGIN_PASSWORD);
    });

    test('C13 POST (/api/verifyLogin) No password key', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email or password parameter is missing in POST request.";
        await authorizationAPI.verifyLogin(Methods.POST,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL,undefined);
    });

    test('C18 GET, PUT, DELETE (/api/verifyLogin) Incorrect req method', async ({ authorizationAPI }) => {
        const expectedCode = Status.methodNotAllowed;
        const expectedMessage = "This request method is not supported.";

        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            await authorizationAPI.verifyLogin(method,expectedCode,expectedMessage,process.env.VALID_LOGIN_EMAIL,process.env.VALID_LOGIN_PASSWORD);
        }
    });
    test('C15 POST (/api/createAccount) Successful registration with valid data', async ({ authorizationAPI }) => {
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

    test('C16 POST (/api/createAccount) Bad req registration with only email and password', async ({ authorizationAPI }) => {
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

    test('C17 POST (/api/createAccount) Success registration with only email and password', async ({ authorizationAPI }) => {
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

    test('C19 POST (/api/createAccount) Duplicate email registration', async ({ authorizationAPI }) => {
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

    test('C14 GET, PUT, DELETE (/api/createAccount) Incorrect req method', async ({ authorizationAPI }) => {
        const expectedCode = Status.methodNotAllowed;

        for (const method of Object.values(Methods)) {
            if (method === 'POST') continue; // skip POST (correct req method)
            let expectedMessage = `Method \"${method}\" not allowed.`;
            const email = await generateRandomEmail();
            await authorizationAPI.createAccount(
                method,
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
        }
    });

    test('C20 GET (/api/getUserDetailByEmail) Valid request with existing user email', async ({ authorizationAPI }) => {
        const expectedCode = Status.success;
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL,expectedCode);
    });

    test('C21 GET (/api/getUserDetailByEmail) Valid request with not existing user email', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "Account not found with this email, try another email!";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,(process.env.VALID_LOGIN_EMAIL + "1"),expectedCode,expectedMessage);
    });

    test('C23 GET (/api/getUserDetailByEmail) Case-insensitive email match', async ({ authorizationAPI }) => {
        const expectedCode = Status.notFound;
        const expectedMessage = "Account not found with this email, try another email!";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,process.env.VALID_LOGIN_EMAIL.toUpperCase(),expectedCode,expectedMessage);
    });

    test('C22 GET (/api/getUserDetailByEmail) Missing email parameter', async ({ authorizationAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, email parameter is missing in GET request.";
        await authorizationAPI.getUserDetailByEmail(Methods.GET,undefined,expectedCode,expectedMessage);
    });

    test('C24 POST, PUT, DELETE (/api/getUserDetailByEmail) Incorrect req method', async ({ authorizationAPI }) => {
        const expectedCode = Status.methodNotAllowed;
        const expectedMessage = "This request method is not supported.";
        for (const method of Object.values(Methods)) {
            if (method === 'GET') continue; // skip POST (correct req method)
            await authorizationAPI.getUserDetailByEmail(method,process.env.VALID_LOGIN_EMAIL,expectedCode,expectedMessage)
        }
    });
});