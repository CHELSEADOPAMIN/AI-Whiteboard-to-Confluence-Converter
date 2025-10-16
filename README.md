# Quick Experience
Now our frontend and backend have been deployed and tested online. You can access them at the following website:

```bash
Frontend: https://s.coly.cc/ai
Backend: https://f.a2a.ing/
```
Before you access our frontend, you may need to login first:

```bash
Email: xiyusheng.2001@gmail.com
Password: TEST1234567
```

Email verification will be required. Check the Gmail account below for the verification code:

```bash
Email: xiyusheng.2001@gmail.com
Password: DLC1008611s
```

# Test Our App:

## Test Coverage& Report
### Coverage:
Backend: 
- Forge Backend API (Node.js, Express, Drizzle ORM, Supabase, Upstash Redis). Tests exercise real integrations where stable and focus on correctness, business logic, and error handling.
- Real DB and storage: PostgreSQL and Supabase storage
- Real queue (robustness only): Upstash Redis
- Happy and sad paths across API and services

Frontend: 
- Unit Testing: Vitest with React Testing Library for component isolation and behavior verification
- E2E Testing: Playwright for full user journey validation
- Real browser integration and user interaction simulation
- Component rendering, state management, and user flow validation

### Tests Report:
Detailed front-end and back-end test reports can be found in the following files respectively:
```bash
Backend: forge-backend/tests/README.md
Frontend: forge-frontend/tests/README.md
```

## Test Our Frontend:

## End-to-End test with Playwright

### Step1. 
Make sure you have Node.js installed, and in the `forge-frontend` directory, run:

```bash
npm install
```
### Step2. 
Then, run the following command to install the test dependencies:

```bash
npx playwright install
```

and wait for the installation to complete.

### Step3. 
Then, run the following command to start the End-to-End test:

```bash
npx playwright test --headed
```

### Notice: 
The first time of running 
```bash
1 [setup] › e2e\setup\auth.setup.ts:79:1 › auth: login, go app, save session // Just to show you how this may looks like, don't paste it into terminal or anywhere
```
may fail due to the Atlassian login page may need 2FA verification, you can just wait few seconds for the re-run of the test, and it will pass.  This is not a bug, but a limitation of the Atlassian login process.

### Step4. 
Then wait for few seconds, the test browser will automatically start and you can see the test process.

### Step5. 
After the test is completed, you will see the test results in the terminal, like this:

```bash
Running 5 tests using 1 worker

  ✓  1 [setup] › e2e\setup\auth.setup.ts:79:1 › auth: login, go app, save session (19.5s)
  ✓  2 [main-flow] › e2e\specs\language.spec.ts:16:3 › Language switching › open app -> click Lang -> iterate all languages and assert button label (12.0s)
  ✓  3 …specs\main-flow.spec.ts:9:3 › AI Whiteboard - Main Flow (upload -> parse -> open new page) › Upload sample image -> set options -> wait result -> Go new Page (33.7s)  ✓  4 ….spec.ts:7:3 › Theme switching (smoke, then open account menu and choose dark) › iterate themes, open account menu, open theme switcher, choose dark, wait 1s (17.4s)  ✓  5 [main-flow] › e2e\specs\user-guide.spec.ts:6:3 › Help wizard: open → next → finish › click Help, go through steps, then Finish (13.8s)

  5 passed (1.7m)
```
### Step 6. 
To see the report, run the following command:
```bash
npx playwright show-report
```

## Frontend Unit Tests

### Step 1.
Make sure you're in the `forge-frontend` directory, then run
```bash
npm install
```
### Step 2.
```bash
npm test
```
Then you can review the results in the terminal:
```bash
 Test Files  8 passed (8)
      Tests  209 passed (209)
   Start at  18:50:20
   Duration  8.85s (transform 993ms, setup 8.62s, collect 24.96s, tests 6.79s, environment 17.26s, prepare 1.57s)
```

## Test Our Backend:

### Step 1.
Make sure you're in the `forge-backend` directory, run
```bash
npm install
```

### Step 2.
Then run
```bash
npm test
```
Then you can review the test results in the terminal:
```bash
Test Suites: 6 passed, 6 total
Tests:       82 passed, 82 total
Snapshots:   0 total
Time:        5.725 s
Ran all test suites.
```
# Frontend Start Guide
Check the `forge-frontend/README.md` file for more details.

# Backend Start Guide
The backend is now packaged as a Docker image. You can run it with one command: 
```bash
docker compose -f forge-backend/docker-compose.yml up -d --build
```
The following tutorial is only for special cases where clients want to deploy and expand it themselves.

### 1. install dependencies

```bash
cd forge-backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` as `.env` and modify configure below:

- `DATABASE_URL`: Your PostgreSQL connect string
- `SUPABASE_URL`: Your Supabase project's URL
- `SUPABASE_ANON_KEY`: Your Supabase anno key
- `UPSTASH_REDIS_REST_URL`: Your Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis token
- `OPENAI_API_KEY`: Your OpenAI API key (optional)
- `GEMINI_API_KEY`: Your Google Gemini API key (option)

3, 4, and 5 are database configurations that need to be performed only during the first run. Other members can directly jump to 6 for use.
Database that already being deployed: https://supabase.com/dashboard/project/otmymkspfdhgqhhvffag
### 3. Database Configuration

Directly push the database structure:
```bash
npx drizzle-kit push:pg
```

### 4. Create Supabase Storage bucket

In the Supabase console's Storage page:
1. Click "Create a new bucket"
2. Set bucket name to `images`
3. Select "Public bucket"
4. Click "Create bucket"

### 5. Supabase Storage permissions

In the Supabase Console's SQL Editor run `supabase/storage_policies.sql`'s contnet.

### 6. Run Server

Development mode:
```bash
npm run dev
```

Run background worker:
```bash
npm run worker
```

Run tests:
```bash
npm run test
```

## API Documentation

---

## Server Health Check

**GET** `/health`

**Response Example**
```json
{
	"status": "OK",
	"timestamp": "202x-xx-xxTxx:xx:xx.xxxZ"
}
```

---

## Create or Check User Existence

**POST** `/api/users`

**Request-body**:
```json
{
	"id": "user123"
}
```

**Response Example**
```json
{
	"message": "User checked or created successfully"
}
```

---

## Upload Image and Create Analysis Task

**POST** `/api/images`

**Request Format**:
Content-Type: `multipart/form-data`

| Field Name  | Type   | Required | Example Value       | Description                                |
| ----------- | ------ | -------- | ------------------- | ------------------------------------------ |
| imageFile   | File   | Yes      | xxx.jpg             | Image file (maximum 10MB)                  |
| user_id     | String | Yes      | user123             | User ID                                    |
| model_name  | String | Yes      | gemini-2.5-flash    | AI model name                              |
| prompt      | String | No       | Please focus on analyzing the business process | User-defined analysis prompt (optional) |
| prompt_type | String | No       | business            | Prompt type (business/general, default: general) |
| language    | String | No       | Chinese             | Output language (default: English)         |


**Response Example**
```json
{
	"message": "Image uploaded and analysis task created successfully",
	"image_id": "Image task ID",
	"image_url": "Image's public URL",
	"status": "pending"
}
```

---

## Query Image Analysis Result

**GET** `/api/images/{image_id}`

**Response Example**
```json
{
	"image_id": "Image task ID",
	"user_id": "user123",
	"image_url": "Image's public URL",
	"summary": "AI analysis result",
	"status": "completed",
	"model_name": "gemini-2.5-flash",
	"created_at": "Timestamp",
	"updated_at": "Timestamp"
}
```

---

## Get User Image History

**GET** `/api/users/{user_id}/images`

**Response Example**
```json
[
	{
		"status": "completed",
		"summary": "AI analysis result summary",
		"image_id": "Image task ID",
		"image_url": "Image's public URL",
		"created_at": "Timestamp",
		"model_name": "gemini-2.5-flash"
	}
]
```

---

## Delete Image Analysis Record

**DELETE** `/api/images/{image_id}?user_id={user_id}`

**Response Example**
```json
{
	"message": "Image deleted successfully"
}
```

---

## Get AI Analysis Capability Information

**GET** `/api/images/capabilities`

**Response Example**
```json
{
	"supportedModels": [
		"gemini-2.5-pro",
		"gemini-2.5-flash",
		"gemini-2.5-flash-lite", 
		"gemini-2.0-flash",
		"gemini-1.5-flash",
		"gpt-4.1",
		"gpt-4.1-mini",
		"gpt-4.1-nano",
		"gpt-4o",
		"gpt-4o-mini",
		"o3",
		"o4-mini"
	],
	"supportedPromptTypes": [
		"business",
		"general"
	],
	"outputSchema": {
		"title": "string - A concise title of the whiteboard content",
		"content": "string - Detailed analysis content in structured HTML format"
	}
}
```

---

## Notes

- All timestamps are in ISO 8601 format.
- Maximum image file size is 10MB, supporting common image formats.
- When deleting images, `user_id` must be passed as a query parameter for permission verification.
- Supports multiple AI models, specific available models depend on API key configuration.
- Prompt types:
  - `business`: Business analysis style, suitable for whiteboard analysis after business meetings.
  - `general`: General analysis style, providing objective and comprehensive content overview.
- Supports multilingual output, including English, Chinese, Japanese, etc.
- User-defined prompt words will be intelligently combined with system template prompt words without replacing the base template.

## Project Architecture

```
forge-backend/
├── src/                          # Source code directory
│   ├── ai/                       # AI analysis core module
│   │   ├── core.js               # AI analysis core logic
│   │   ├── models.js             # Multi-AI model management (OpenAI + Gemini)
│   │   ├── prompts.js            # Analysis prompt template management
│   │   ├── schemas.js            # AI output data structure definition
│   │   └── security.js           # AI security validation and filtering
│   ├── middleware/               # Middleware layer, unified management of all middleware
│   │   └── index.js              # CORS, logging, error handling, etc.
│   ├── services/                 # Business logic layer, encapsulating specific business implementations
│   │   ├── userService.js        # User business logic
│   │   ├── imageService.js       # Image business logic
│   │   └── aiAnalysisService.js  # AI analysis business logic
│   ├── controllers/              # Controller layer, handling parameter validation and business invocation
│   │   ├── userController.js     # User-related controllers
│   │   └── imageController.js    # Image-related controllers
│   ├── models/                   # Database model definition layer
│   │   ├── users.js              # User table model (Drizzle ORM)
│   │   └── images.js             # Image table model (Drizzle ORM)
│   ├── routes/                   # API route definition layer, only responsible for API interface distribution
│   │   ├── users.js              # User-related API routes
│   │   └── images.js             # Image-related API routes
│   └── app.js                    # Application configuration, route registration, and middleware configuration
├── config/                       # Configuration file directory
│   ├── database.js               # Redis connection configuration
│   ├── drizzle.js                # Drizzle ORM database connection
│   └── storage.js                # Supabase Storage configuration
├── tests/                        # Test files directory
│   ├── api/                      # API integration tests
│   │   ├── images.test.js        # Image API tests
│   │   └── users.test.js         # User API tests
│   ├── unit/                     # Unit tests
│   │   ├── services/             # Service layer unit tests
│   │   │   ├── aiAnalysisService.test.js
│   │   │   ├── imageService.test.js
│   │   │   └── userService.test.js
│   │   └── worker.test.js        # Worker process tests
│   ├── fixtures/                 # Test fixtures and sample data
│   │   └── test.png              # Sample test image
│   ├── helpers/                  # Test helper functions
│   │   └── testData.js           # Test data generators
│   ├── setup.js                  # Test environment setup
│   └── README.md                 # Test documentation
├── drizzle/                      # Database migration files
│   ├── 0000_deep_vision.sql      # Initial migration
│   ├── 0001_rare_famine.sql      # Schema updates
│   └── meta/                     # Migration metadata
│       ├── _journal.json         # Migration journal
│       ├── 0000_snapshot.json    # Schema snapshots
│       └── 0001_snapshot.json
├── coverage/                     # Test coverage reports
│   ├── lcov-report/              # HTML coverage report
│   └── lcov.info                 # Coverage data file
├── supabase/                     # Supabase-related files
│   └── storage_policies.sql      # Storage permission policy SQL
├── docker-compose.yml            # Docker compose configuration
├── Dockerfile.api                # API service Docker configuration
├── Dockerfile.worker             # Worker service Docker configuration
├── server.js                     # Server startup entry, only responsible for startup
├── worker.js                     # Background task processor, only responsible for scheduling
├── jest.config.js                # Jest testing framework configuration
├── drizzle.config.js             # Drizzle Kit tool configuration
├── package.json                  # Project dependency configuration
├── package-lock.json             # Locked dependency versions
└── README.md                     # Project documentation


forge-frontend/                   # Frontend
├── src/                          # Source code directory. Each folder's index.js is a unified export file
│   ├── components/               # UI components organized by functionality
│   │   ├── common/               # Reusable components across the app
│   │   │   ├── AppBackground.jsx # Application background component
│   │   │   ├── AppHeader.jsx     # Application header
│   │   │   ├── CardButtons.jsx   # Card action buttons
│   │   │   ├── ConfirmDeleteDialog.jsx # Delete confirmation dialog
│   │   │   ├── FloatingExit.jsx  # Floating exit button
│   │   │   ├── HistoryCard.jsx   # History item card
│   │   │   ├── MainCard.jsx      # Main content card
│   │   │   └── Tip.jsx           # Tooltip component
│   │   ├── main/                 # Main application flow components
│   │   │   ├── Edit.jsx          # Content editing interface
│   │   │   ├── Loading.jsx       # Loading state component
│   │   │   ├── Result.jsx        # Analysis result display
│   │   │   ├── Settings.jsx      # Application settings
│   │   │   ├── ToolBar.jsx       # Main toolbar
│   │   │   ├── Upload.jsx        # Image upload interface
│   │   │   └── UserHistory.jsx   # User history management
│   │   ├── setting/              # Settings-related components
│   │   │   ├── HelpCenter.jsx    # Help and documentation
│   │   │   ├── LangMenu.jsx      # Language selection menu
│   │   │   ├── ThemeMenu.jsx     # Theme selection menu
│   │   │   └── Tutorial.jsx      # User onboarding tutorial
│   │   ├── toolbar/              # Toolbar-specific components
│   │   │   ├── ToolbarIconButton.jsx # Icon button for toolbar
│   │   │   ├── ToolbarInput.jsx  # Input field for toolbar
│   │   │   └── ToolbarSelect.jsx # Select dropdown for toolbar
│   │   └── index.js              # Components unified export
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePageCreation.js    # Atlassian page creation logic
│   │   ├── useSaveSetting.js     # Settings persistence hook
│   │   ├── useSaveToolbar.js     # Toolbar state management
│   │   └── index.js              # Hooks unified export
│   ├── i18n/                     # Internationalization
│   │   ├── languages/            # Language definition files
│   │   │   ├── en.json           # English translations
│   │   │   ├── es.json           # Spanish translations
│   │   │   ├── fr.json           # French translations
│   │   │   ├── it.json           # Italian translations
│   │   │   ├── ja.json           # Japanese translations
│   │   │   └── zh.json           # Chinese translations
│   │   └── LanguageSwitch.js     # Language switching logic
│   ├── theme/                    # Theme management
│   │   ├── themes/               # Theme definitions
│   │   │   ├── Cloud.js          # Cloud theme
│   │   │   ├── Default.js        # Default theme
│   │   │   ├── RedGreenColorblind.js # Accessibility theme
│   │   │   └── Sea.js            # Sea theme
│   │   ├── ThemeContext.js       # Theme context provider
│   │   ├── ThemeSwitch.jsx       # Theme switching component
│   │   └── useThemeContext.js    # Theme context hook
│   ├── services/                 # External service integrations
│   │   ├── imageAnalysis.js      # AI image analysis service
│   │   ├── imageService.js       # Image management service
│   │   ├── userService.js        # User management service
│   │   └── index.js              # Services unified export
│   ├── utils/                    # Utility functions
│   │   ├── api.js                # API communication utilities
│   │   ├── mapLang.js            # Language mapping utilities
│   │   ├── parseSummary.js       # Content parsing utilities
│   │   └── index.js              # Utils unified export
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── test/                         # Test files
│   ├── unit/                     # Unit tests
│   │   ├── CompCommon.test.jsx   # Common components tests
│   │   ├── CompMain.test.jsx     # Main components tests
│   │   ├── CompSetting.test.jsx  # Settings components tests
│   │   ├── CompToolBar.test.jsx  # Toolbar components tests
│   │   ├── Hooks.test.jsx        # Custom hooks tests
│   │   ├── i18n.test.jsx         # Internationalization tests
│   │   ├── Theme.test.jsx        # Theme management tests
│   │   └── Utils.test.jsx        # Utility functions tests
│   ├── imports.js                # Centralized test imports
│   ├── setupTests.js             # Test environment setup
│   └── README.md                 # Test documentation
├── e2e/                          # End-to-end tests
│   ├── specs/                    # Test specifications
│   │   ├── language.spec.ts      # Language switching tests
│   │   ├── main-flow.spec.ts     # Main application flow tests
│   │   ├── theme.spec.ts         # Theme switching tests
│   │   └── user-guide.spec.ts    # User tutorial tests
│   ├── pages/                    # Page object models
│   │   └── AppPage.ts            # Main app page model
│   ├── setup/                    # Test setup and authentication
│   │   └── auth.setup.ts         # Authentication setup for tests
│   ├── images/                   # Test image assets
│   ├── utils/                    # Test utilities
│   │   └── gmail.js              # Email testing utilities
│   ├── get-token.js              # Token acquisition utility
│   └── token.json                # Stored authentication tokens
├── coverage/                     # Test coverage reports
│   ├── lcov-report/              # HTML coverage report
│   └── lcov.info                 # Coverage data file
├── dist/                         # Built application files
│   ├── assets/                   # Compiled assets (CSS, JS)
│   ├── images/                   # Optimized images
│   └── index.html                # Main HTML file
├── public/                       # Static public assets
│   ├── icons/                    # Application icons
│   │   └── logo.png              # Application logo
│   └── images/                   # Public images
│       ├── cloud.png             # Cloud theme background
│       └── coconut_tree.png      # Sea theme background
├── playwright-report/            # Playwright test reports
├── eslint.config.js              # ESLint configuration
├── playwright.config.ts          # Playwright testing configuration
├── vite.config.js                # Vite build tool configuration
├── manifest.yml                  # Atlassian app manifest
├── index.html                    # Development HTML template
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
└── README.md                     # Project documentation
```

### Architecture Description

**Backend - MVC+Service Layered Architecture**:
- **AI Module**: Independent AI analysis core with security validation, multi-model management, and intelligent prompt templates
- **Models**: Use Drizzle ORM to define database table structures with migration support
- **Services**: Encapsulate specific business logic, interact with databases and third-party services
- **Controllers**: Handle parameter validation, exception capture, and call service layer
- **Routes**: Only responsible for API endpoint definition and distribution, no business logic included
- **Middleware**: Unified management of cross-cutting concerns, such as CORS, logging, error handling
- **Testing**: Comprehensive test suite with unit tests, API integration tests, and coverage reporting
- **Docker Support**: Containerized deployment with separate API and worker services

**Frontend - Component-Based Architecture**:
- **Component Organization**: Structured by functionality (common, main flow, settings, toolbar)
- **Theme System**: Multi-theme support with accessibility considerations and automatic dark/light mode detection
- **Internationalization**: Full i18n support with multiple language packs
- **Custom Hooks**: Reusable logic for Atlassian integration, settings persistence, and state management
- **Testing**: Unit tests for all major components and utilities, plus comprehensive E2E testing with Playwright
- **Build System**: Vite-based build with optimized asset bundling and development experience

**Tech Stack**:
- **Database**: PostgreSQL + Drizzle ORM with migration management
- **File Storage**: Supabase Storage with policy-based access control
- **Cache Queue**: Upstash Redis for background task management
- **AI Analysis**: Multi-provider AI (Google Gemini + OpenAI) with security filtering
- **Server**: Express.js with comprehensive middleware stack
- **Frontend**: React 18 + Vite with Material-UI components
- **Testing**: Jest (backend) + Vitest (frontend) + Playwright (E2E)
- **Deployment**: Docker containerization with multi-service architecture

**AI Analysis Features**:
- **Multi-model Support**: Supports OpenAI GPT series and Google Gemini series models with automatic fallback
- **Security Filtering**: AI-powered content validation and security screening
- **Intelligent Prompts**: Business analysis and general analysis professional templates with custom prompt injection
- **Multilingual Output**: Supports analysis results in multiple languages (English, Chinese, Japanese, Spanish, French, Italian)
- **Custom Extensions**: Users can add custom analysis requirements that intelligently combine with system templates

**Quality Assurance**:
- **Comprehensive Testing**: Unit tests, integration tests, and end-to-end testing coverage
- **Code Coverage**: Automated coverage reporting for both frontend and backend
- **Type Safety**: TypeScript configuration for frontend development
- **Linting**: ESLint configuration for code quality maintenance
- **Performance**: Optimized build process and asset loading
---

# Changelog

### 2025-7-28
- The three built-in themes can now automatically switch modes based on the light/dark mode of the parent page (Atlassian page).


### 2025-7-26
- In-app guide for first-time users
- Enhanced UX for onboarding flow

## 2025-7-22
- Limit on the number of images a user can upload (10 images)
- Model switching functionality when the AI model limit is reached (switched to gpt-4.1-nano)

## 2025-7-21
- History: Added deletion confirmation, a confirmation dialog will pop up when the user deletes the history
- History: Multi-language support for deletion confirmation

## 2025-07-12
- Modified the icon in the toolbar

## 2025-07-10
- Implemented theme switching function, in addition, added animation and background
- Implemented translation function (not using Atlassian API, but another package)
- Refactored the code with MUI
- UI optimization, added UI responsiveness and modified layout
- Added "Delete Single Record" function and "Rebuild Page" function in the history section 
	(the difference between rebuild and reanalysis is that rebuild does not require interaction with the backend)
- Modified the display logic of history and upload controls (only one upload method can be seen at the same time to avoid bugs)
- Added the function of using thumbnails directly, which will be slightly faster.
- Added "Help Center" component, currently empty. Template preview will be written here later
- Added the function of jumping to a new page with one click after publishing a page
- Added the function of restoring presets
- Added the function of editing while previewing 
	(but this rich text editor does not seem to support tables, and it seems that the table extension package needs to be installed)
- Fixed the problem of static resource loss
- Fixed the problem of not being able to drag and drop uploaded image files


## 2025-07-06
- Implemented the Auto Clear function. Users can enable the automatic clear history option in the settings
- Added a return button on the Step 3 page so that users can return to Step 1 and start over
- Implemented the Direct Publish function so that users can skip Step 3 and directly generate the Confluence page
- Optimized the image processing logic and converted the image to base64 encoding and embedded it 
	in the page content to prevent image damage after Auto Clear
- Fixed the time display issue and used local time instead of UTC time to generate the page title
- Enhanced the history function so that users can click on the history image to directly re-analyze
- Support user-defined content style prompt words. Users can enter custom prompt words in the settings for content generation
- Optimized the Step 2 polling logic to achieve real-time progress display and a cool rainbow pulse progress bar

## 2025-07-05
- Added content style selection function, providing five styles: concise summary, detailed analysis, structured table, bullet point list, and narrative description
- Realize intelligent splicing of content style and custom prompt words, and automatically combine user input with template prompt words
- Optimize the user experience of the settings page to achieve real-time saving without manually clicking the save button
- The settings page is only displayed in the first step to keep the page neat for subsequent analysis processes
- Optimize the overall layout, reduce spacing and padding, and make the interface more compact
- Move the settings page from the bottom to the top shortcut bar, and provide detailed instructions through hover prompts
- User settings are automatically saved to cookies, supporting cross-session persistence

## 2025-07-03
- Refactor the front-end directory structure
- Automatically obtain user information when the App is loaded and store it in the database
- Add user history function and support one-click deletion
- The preview interface adopts the strategy of directly rendering HTML elements, and the content cannot be modified

## 2025-07-02
- Fixed the issue that Supabase Storage does not support Chinese file names
- Added the image_url field to the user image history API response and removed the prompt field
- Removed the prompt and parameters fields from the query image analysis result API response
- Fixed the AI analysis parameter temperature to 0 to ensure consistent generation results
- The backend always has the default prompt word, and the content sent by the frontend is spliced after the default prompt word, and the default prompt word will not be replaced

---
