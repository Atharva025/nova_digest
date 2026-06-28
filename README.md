# NovaDigest 🗞️

NovaDigest is a full-stack, responsive news aggregator and reader application. It allows users to register, select their favorite news genres, search for specific topics, browse a paginated feed of the latest news, read scraped full-length articles with embedded social media (Twitter/Instagram), and write comments.

---

## Table of Contents
- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Important Technical Notes & Gotchas](#important-technical-notes--gotchas)
- [Team Members](#team-members)

---

## Features

### 1. User Authentication & Profile Context
* **Sign Up**: Secure sign-up flow requiring name, password, password confirmation, and selection of at least 2 categories/genres.
* **Login**: Authentication against a MongoDB database.
* **Persistent Session**: Keeps the user logged in using `localStorage` and a React Context Provider (`UserProvider`).
* **Interactive Header**: Displays the logged-in user's name with a dropdown option to log out.

### 2. Tailored Genre Selection
* User onboarding includes a visually rich card-based selection screen for interests.
* Supported genres include:
  * **Politics**
  * **Sports**
  * **Movies**
  * **Finance**
  * **International**
  * **National**

### 3. Dynamic News Feed & Search Dashboard
* **Dynamic Search**: An instant search input to query any news category.
* **API Integration**: Connects to `NewsAPI` (`/everything` endpoint) to fetch up-to-date global news articles matching selected/searched genres.
* **Responsive Layout**: Designed with TailwindCSS, adapting perfectly to mobile, tablet, and desktop screens.
* **Skeleton Loaders**: Features skeleton screens (using MUI Skeleton UI) to enhance UX during load times.
* **MUI Pagination**: Smooth page-to-page navigation limiting search lists to 20 articles per page.

### 4. Full Article Scraper & Reader
* **CORS Proxying**: Leverages `cors-anywhere` to resolve CORS limitations when fetching foreign news pages.
* **Text Scraping**: Leverages `DOMParser` to extract all `<p>` paragraphs from the news source page for seamless native reading.
* **Social Media Embeds**: Scrapes, extracts, and dynamically mounts Twitter tweets (`blockquote.twitter-tweet`) and Instagram media posts.
* **Read More / Less Toggles**: Displays an initially truncated description (up to 1,000 characters) and expands to full text upon clicking "Read More".

### 5. Interactive Comments Section
* Interactive text box to submit comments on any news article.
* Comments are stored in memory (`CommentsAll.js`) and persistent storage (`localStorage`).

---

## Architecture & Tech Stack

### Frontend
* **Core**: React v18 + Vite (Fast Refresh enabled)
* **Routing**: React Router DOM (v6) for multi-view navigation
* **Styling**: TailwindCSS & Autoprefixer for utility-based styling, combined with Custom Vanilla CSS
* **UI Components**: Material-UI (MUI v5)
* **Metadata & Embed Integration**: React Helmet (asynchronously loading Twitter widgets script)

### Backend
* **Server Framework**: Express.js (Node.js)
* **Database & ODM**: MongoDB database (`form_details`) with Mongoose
* **CORS**: Configured with CORS middleware to authorize client-side queries

---

## Project Structure

```text
nova_digest/
├── src/
│   ├── backend/
│   │   ├── connection.js       # MongoDB connection script (mongoose)
│   │   ├── index.js            # Express server entry point & API endpoints
│   │   └── user.js             # Mongoose User schema and model mapping
│   ├── components/
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── CommentsAll.js      # Global comments state manager
│   │   ├── Genre_Types.js      # Constant list of available genres & images
│   │   ├── News.js             # Local news mock data / fallback module
│   │   └── Team_Members.js     # List of project creators
│   ├── css/                    # Custom CSS styling sheets for various components
│   ├── images/                 # Image assets for genres and placeholders
│   ├── About_Us.jsx            # About us page
│   ├── App.jsx                 # Application routes and main entry wrapper
│   ├── Comments.jsx            # Article comments UI
│   ├── Footer.jsx              # Global footer component
│   ├── Genre.jsx               # Genre selection grid
│   ├── Header.jsx              # Global navigation header
│   ├── Home_Page.jsx           # Main news dashboard containing search & feed
│   ├── Loader.jsx              # Animated spinner loaders
│   ├── Login_Form.jsx          # Login view and form handling
│   ├── News_Card.jsx           # MUI Card displaying a news snippet in the grid
│   ├── News_Full.jsx           # Main article view with web scraping and comments
│   ├── Sign_Up_Form.jsx        # Signup view, input validation, and genre selection
│   ├── UserProvider.jsx        # Context provider for managing active user state
│   ├── userContext.js          # React Context initialization for users
│   ├── index.css               # Global Tailwind directives
│   └── main.jsx                # React app mounting script
├── index.html                  # HTML template containing Twitter widgets script loader
├── vite.config.js              # Vite packaging config
├── tailwind.config.js          # TailwindCSS structure rules
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project dependencies and script runner configurations
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).
* Ensure you have [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017`.

### Backend Setup
1. Open a terminal and navigate to the backend directory or run from root:
   ```bash
   node src/backend/index.js
   ```
2. The server will start running on port `3000` with the database connection established.

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## Important Technical Notes & Gotchas

1. **Express `alert()` Calls**:
   Inside `src/backend/index.js`, lines 29 and 33 call `alert()`. Since `alert()` is a browser-exclusive global API and does not exist in Node.js runtime environments, calling this endpoint without a registered user or with an invalid password will trigger a backend runtime crash. *Recommendation: Replace this with server-side validation error JSON payloads.*
2. **PropType Errors**:
   In `src/Header.jsx`, propTypes validation lists `setSelectedGenre: Function` instead of `PropTypes.func`. This can trigger React console warnings.
3. **Hardcoded API Key**:
   The `NewsAPI` key is hardcoded directly inside the fetch URL in `src/Home_Page.jsx`. Ideally, it should be moved to a `.env` file and referenced via `import.meta.env.VITE_NEWS_API_KEY`.
4. **CORS Proxy Dependencies**:
   The web scraper inside `src/News_Full.jsx` relies on `https://cors-anywhere.herokuapp.com/` which requires request authorization/activation in a browser session. If fetching fails, the application might display "Unable to load content".

---

## Team Members
* **Akberali**
* **Saachi**
* **Atharva**
