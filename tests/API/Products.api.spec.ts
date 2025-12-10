import { apiTest as test } from '../../Helper/Fixtures.ts';
import { Methods, Status, Messages } from '../../Helper/API_Helper.ts';

test.describe("API Product & Catalog tests", () => {
    test('C28 GET /api/brandsList returns valid brand list', async ({ productsAPI }) => {
        await productsAPI.brandsList(Methods.GET,Status.success);
    });

    test('C27 POST, PUT, DELETE (/api/brandsList) Incorrect req method', async({ productsAPI }) => {
        for (const method of Object.values(Methods)) {
            if(method === "GET") continue;
            await productsAPI.brandsList(method,Status.methodNotAllowed,Messages.notSupportedReqMethodMessage);
        }
    });

    test('C25 POST /api/searchProduct returns products for valid keywords', async ({ productsAPI }) => {
        const productsNames = ["dress","top","tshirt"]; //keyWords
        for(const productsName of productsNames){
            await productsAPI.searchProduct(Methods.POST,Status.success,"",productsName);
        }
    });

    test('C26 GET, PUT, DELETE (/api/searchProduct) Incorrect req method', async({ productsAPI }) => {
        for (const method of Object.values(Methods)) {
            if(method === "POST") continue;
            await productsAPI.searchProduct(method,Status.methodNotAllowed,Messages.notSupportedReqMethodMessage,"top");
        }
    });

    test('C29 POST /api/searchProduct returns empty result for non-existent product', async ({ productsAPI }) => {
        await productsAPI.searchProduct(Methods.POST,Status.success,"","top1231");
    });

    test('C30 POST /api/searchProduct returns 400 Bad Request when keyword is missing', async ({ productsAPI }) => {
        await productsAPI.searchProduct(Methods.POST,Status.badReq,Messages.badRequestParameterMessage(Methods.POST,"search_product"),"");
    });
});