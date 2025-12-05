# Playwright E2E and API Tests for AutomationExercise

![Playwright](https://img.shields.io/badge/Playwright-Testing-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![CI/CD](https://img.shields.io/badge/GitHub-Actions-green)

This is a **personal practice project** containing both **E2E UI** and **API automation** for  [Automationexercise](http://automationexercise.com) 
built using **Playwright (TypeScript)**.

---

## 🧰 Tech Stack

- **[Playwright 1.54](https://playwright.dev/)** - UI / API tests 
- **[TypeScript 5.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html)** - Language
- **[Zod](https://zod.dev/)** – schema validation
- **[dotenv](https://www.npmjs.com/package/dotenv)** – environment variables
- **[npm-run-all](https://www.npmjs.com/package/npm-run-all)** – A CLI tool to run multiple npm-scripts in parallel or sequential.
- **[TestRail CLI](https://support.testrail.com/hc/en-us/articles/7146548750868-Getting-Started-with-the-TestRail-CLI#h_01K24KKX36ZBPE18DSKAE4CY3P)** – specification-first workflow
- **[GitHub Actions](https://github.com/features/actions)** – CI/CD pipeline (only with main branch)

---

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
```
---
## 🛠 Setup & Configuration

### Create a .env File
```
VALID_LOGIN_EMAIL=
VALID_LOGIN_PASSWORD=
VALID_LOGIN_NAME_FIRST=

REGISTER_TITLE=
REGISTER_NAME_FIRST=
REGISTER_NAME_LAST=
REGISTER_PASSWORD=
REGISTER_BIRTH_DAY=
REGISTER_BIRTH_MONTH=
REGISTER_BIRTH_YEAR=
REGISTER_ADDRESS=
REGISTER_ADDRESS2=
REGISTER_COUNTRY=
REGISTER_STATE=
REGISTER_CITY=
REGISTER_ZIPCODE=
REGISTER_COMPANY_NAME=
REGISTER_MOBILE_NUMBER=

CARD_NUMBER=
CARD_CVC=
CARD_EXPIRY_MONTH=
CARD_EXPIRY_YEAR=

TRCLI_HOST=
TRCLI_USER=
TRCLI_KEY=
```

### Run tests using the following command:
1. **If you have TestRail set up in the project:** 
    ```npm run test```- this will run:
    1. "pretest" cleans up previous test result folders (screenshots, traces, videos).
    2. "testonly" runs all Playwright tests and saves screenshots, traces, and videos to test result folders.
    3. "trcli" uploads test results to TestRail and attaches all screenshots, traces, and videos to the corresponding test runs by ID.

2. **If you don't have TestRail set up in the project:** 
    ```npm run test-pretest-only``` - this will run:
    1. "pretest" cleans up previous test result folders (screenshots, traces, videos).
    2. "testonly" runs all Playwright tests and saves screenshots, traces, and videos to test result folders.
    
---
## Example of TestRail tracking
![Screenshot_26](https://github.com/user-attachments/assets/44ab1b94-18f5-46ea-982a-15a835c4f051)
<img width="3018" height="1722" alt="image" src="https://github.com/user-attachments/assets/081180ff-f472-4154-8a70-529051692a09" />
---


## 🚀 Features Covered

### E2E Feature Groups
- **Authorization**
- **Cart & Checkout**
- **Products**
- **Subscription**
- **Contact & Pages**

### API Feature Groups
- **Authentication / Users**
- **Products**
- **Brands**

## Author

- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://www.linkedin.com/in/vladyslav-prudkohliad/)
- [![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/NGon001)
