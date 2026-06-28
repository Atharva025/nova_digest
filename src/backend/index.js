import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import bcrypt from 'bcryptjs';
import cors from "cors";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import "./connection.js";
import Users from './user.js';
import ArticleComment from './comment.js';

// Simple in-memory cache for news responses
const newsCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const API_KEYS = process.env.NEWS_API_KEYS 
    ? process.env.NEWS_API_KEYS.split(',').map(k => k.trim())
    : [];

if (API_KEYS.length === 0) {
    console.warn("WARNING: NEWS_API_KEYS environment variable is not defined!");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/api/sign_up", async (req, res) => {
    try {
        const { username, password, genre } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let user = new Users({
            username,
            password: hashedPassword,
            genre: genre || []
        });

        let result = await user.save();
        res.status(201).json({ message: "User registered successfully", user: { username: result.username, genre: result.genre } });
    } catch (error) {
        console.error('Error saving user', error);
        res.status(500).json({ error: 'Error saving user' });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json({ error: 'Invalid password' });
        }

        res.send({ message: 'Login successful', user: { username: user.username, genre: user.genre } });
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post("/home", async (req, res) => {
    const { username } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        res.send({ user: { username: user.username, genre: user.genre } });
    } catch (error) {
        console.error('Error verifying user', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Bookmarks endpoints
app.get("/api/bookmarks/:username", async (req, res) => {
    const { username } = req.params;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ bookmarks: user.bookmarks || [] });
    } catch (error) {
        console.error('Error fetching bookmarks', error);
        res.status(500).json({ error: 'Error fetching bookmarks' });
    }
});

app.post("/api/bookmarks", async (req, res) => {
    const { username, article, tag } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const exists = user.bookmarks.some(b => b.url === article.url);
        if (exists) {
            return res.status(400).json({ error: 'Article already bookmarked' });
        }
        const articleWithTag = { ...article, tag: tag || 'General' };
        user.bookmarks.push(articleWithTag);
        await user.save();
        res.status(200).json({ message: 'Bookmark added', bookmarks: user.bookmarks });
    } catch (error) {
        console.error('Error adding bookmark', error);
        res.status(500).json({ error: 'Error adding bookmark' });
    }
});

app.delete("/api/bookmarks", async (req, res) => {
    const { username, url } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.bookmarks = user.bookmarks.filter(b => b.url !== url);
        await user.save();
        res.status(200).json({ message: 'Bookmark removed', bookmarks: user.bookmarks });
    } catch (error) {
        console.error('Error removing bookmark', error);
        res.status(500).json({ error: 'Error removing bookmark' });
    }
});

app.put("/api/bookmarks/tag", async (req, res) => {
    const { username, url, tag } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const bookmark = user.bookmarks.find(b => b.url === url);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        bookmark.tag = tag || 'General';
        await user.save();
        res.status(200).json({ message: 'Bookmark tag updated', bookmarks: user.bookmarks });
    } catch (error) {
        console.error('Error updating bookmark tag', error);
        res.status(500).json({ error: 'Error updating bookmark tag' });
    }
});

app.get("/api/user/profile/:username", async (req, res) => {
    const { username } = req.params;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            username: user.username,
            genre: user.genre || [],
            email: user.email || '',
            bookmarkCount: user.bookmarks ? user.bookmarks.length : 0,
            searchHistory: user.searchHistory || [],
            readArticlesCount: user.readArticlesCount || 0,
            readingStreak: user.readingStreak || { count: 0 }
        });
    } catch (error) {
        console.error('Error fetching profile', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

app.put("/api/user/profile/genre", async (req, res) => {
    const { username, genre } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.genre = genre || [];
        await user.save();
        res.status(200).json({ message: 'Genre preferences updated successfully', genre: user.genre });
    } catch (error) {
        console.error('Error updating genre preferences', error);
        res.status(500).json({ error: 'Error updating genre preferences' });
    }
});

app.put("/api/user/profile/email", async (req, res) => {
    const { username, email } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.email = email || '';
        await user.save();
        res.status(200).json({ message: 'Email address updated successfully', email: user.email });
    } catch (error) {
        console.error('Error updating email address', error);
        res.status(500).json({ error: 'Error updating email address' });
    }
});

app.post("/api/user/sync-search", async (req, res) => {
    const { username, searchHistory } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const uniqueHistory = Array.from(new Set([...(searchHistory || []), ...(user.searchHistory || [])])).slice(0, 8);
        user.searchHistory = uniqueHistory;
        await user.save();
        res.status(200).json({ message: 'Search history synced successfully', searchHistory: user.searchHistory });
    } catch (error) {
        console.error('Error syncing search history', error);
        res.status(500).json({ error: 'Error syncing search history' });
    }
});

app.post("/api/user/track-read", async (req, res) => {
    const { username, genre } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.readArticlesCount = (user.readArticlesCount || 0) + 1;

        // Manage reading streak
        const now = new Date();
        const lastRead = user.readingStreak?.lastRead;
        if (!lastRead) {
            user.readingStreak = { count: 1, lastRead: now };
        } else {
            const diffTime = Math.abs(now - new Date(lastRead));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                user.readingStreak.count += 1;
                user.readingStreak.lastRead = now;
            } else if (diffDays > 1) {
                user.readingStreak.count = 1;
                user.readingStreak.lastRead = now;
            }
        }

        // Manage genre preference tracking
        if (genre) {
            let genreEntry = user.readGenres.find(g => g.name.toLowerCase() === genre.toLowerCase());
            if (!genreEntry) {
                user.readGenres.push({ name: genre, count: 1 });
            } else {
                genreEntry.count += 1;
            }

            // Adaptive Feed: Update user preferences (user.genre) with their top 3 read genres
            const sortedGenres = [...user.readGenres].sort((a, b) => b.count - a.count);
            user.genre = sortedGenres.slice(0, 3).map(g => g.name);
        }

        await user.save();
        res.status(200).json({
            message: 'Reading tracked successfully',
            readArticlesCount: user.readArticlesCount,
            readingStreak: user.readingStreak,
            genre: user.genre
        });
    } catch (error) {
        console.error('Error tracking article read', error);
        res.status(500).json({ error: 'Error tracking article read' });
    }
});

app.get("/api/scrape", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }
    try {
        let html = '';
        try {
            // Method 1: Axios with standard headers
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                timeout: 8000
            });
            html = response.data;
        } catch (axiosErr) {
            console.warn(`Axios scraping failed (${axiosErr.message}). Attempting native fetch fallback...`);
            // Method 2: Native node fetch fallback (resilient to certain TLS fingerprint & accept header rejections)
            const resFetch = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            if (!resFetch.ok) {
                throw new Error(`Native fetch also failed with status ${resFetch.status}`);
            }
            html = await resFetch.text();
        }

        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article || !article.textContent) {
            return res.status(404).json({ error: "Failed to extract readable article content." });
        }

        // Clean up double spacing/tabs
        let cleanedContent = article.textContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n\n');

        res.status(200).json({
            title: article.title,
            content: cleanedContent,
            byline: article.byline,
            excerpt: article.excerpt
        });
    } catch (error) {
        console.error("Scraping error for URL:", url, "-", error.message);
        res.status(500).json({ error: "Failed to load and scrape the original news source." });
    }
});

app.get("/api/comments", async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: "Article URL is required" });
    }
    try {
        const comments = await ArticleComment.find({ articleUrl: url }).sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to load comments" });
    }
});

app.post("/api/comments", async (req, res) => {
    const { username, url, comment } = req.body;
    if (!url || !username || !comment) {
        return res.status(400).json({ error: "Username, article URL, and comment text are required" });
    }
    try {
        const newComment = new ArticleComment({
            articleUrl: url,
            userName: username,
            comment: comment.trim()
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error saving comment:", error);
        res.status(500).json({ error: "Failed to save comment" });
    }
});

app.get("/api/news", async (req, res) => {
    const q = req.query.q || '';
    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Check Cache
    const cached = newsCache.get(q);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return res.status(200).json(cached.data);
    }

    let lastError = null;
    for (const key of API_KEYS) {
        try {
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&apiKey=${key}`;
            const response = await axios.get(url);
            const data = response.data;
            
            // Save to Cache
            newsCache.set(q, {
                timestamp: Date.now(),
                data: data
            });
            
            return res.status(200).json(data);
        } catch (error) {
            console.error(`Error fetching news with key ...${key.slice(-6)}:`, error.message);
            lastError = error;
        }
    }

    res.status(502).json({
        error: "Failed to retrieve news from upstream feeds.",
        details: lastError ? lastError.message : 'No API keys resolved successfully.'
    });
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;