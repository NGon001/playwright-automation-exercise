import { apiTest as test, Methods, Status  } from '../../Helper/base.ts';

test.describe("API Product & Catalog tests", () => {
    test('C3860 GET /api/brandsList returns valid brand list', async ({ productsAPI }) => {
        const expectedCode = Status.success;
        await productsAPI.brandsList(Methods.GET,expectedCode);
    });

    test('C3861 POST, PUT, DELETE (/api/brandsList) Incorrect req method', async({ productsAPI }) => {
        const expectedCode = Status.methodNotAllowed;
        const expectedMessage = "This request method is not supported.";
        for (const method of Object.values(Methods)) {
            if(method === "GET") continue;
            await productsAPI.brandsList(method,expectedCode,expectedMessage);
        }
    });

    test('C3862 POST /api/searchProduct returns products for valid keywords', async ({ productsAPI }) => {
        const expectedCode = Status.success;
        const productsNames = ["dress","top","tshirt"]; //keyWords
        for(const productsName of productsNames){
            await productsAPI.searchProduct(Methods.POST,expectedCode,undefined,productsName);
        }
    });

    test('C3863 GET, PUT, DELETE (/api/searchProduct) Incorrect req method', async({ productsAPI }) => {
        const expectedCode = Status.methodNotAllowed;
        const expectedMessage = "This request method is not supported.";
        for (const method of Object.values(Methods)) {
            if(method === "POST") continue;
            await productsAPI.searchProduct(method,expectedCode,expectedMessage,"top");
        }
    });

    test('C3864 POST /api/searchProduct returns empty result for non-existent product', async ({ productsAPI }) => {
        const expectedCode = Status.success;
        await productsAPI.searchProduct(Methods.POST,expectedCode,undefined,"top1231");
    });

    test('C3865 POST /api/searchProduct returns 400 Bad Request when keyword is missing', async ({ productsAPI }) => {
        const expectedCode = Status.badReq;
        const expectedMessage = "Bad request, search_product parameter is missing in POST request."
        await productsAPI.searchProduct(Methods.POST,expectedCode,expectedMessage,undefined);
    });
});