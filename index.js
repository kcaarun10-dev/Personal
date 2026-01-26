const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Vercel uses port 3000
const NODE_ENV = process.env.NODE_ENV || 'development';

// Production middleware
if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (NODE_ENV === 'production') {
        res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// CORS middleware
app.use((req, res, next) => {
    const origin = NODE_ENV === 'production' ? 'https://arunregmi.com.np' : '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname)));

// API Routes
app.get('/api/portfolio', (req, res) => {
    res.json({
        name: "Arun Regmi",
        title: "Web Developer",
        description: "Crafting fast, modern, accessible web experiences and useful online tools.",
        skills: {
            frontend: ["HTML/CSS", "JavaScript", "React/Vue"],
            backend: ["Firebase", "Node.js", "Express"],
            tools: ["GitHub", "Cloudflare", "UI/UX", "Performance", "SEO"]
        },
        services: [
            {
                name: "Web Development",
                description: "Custom websites and web apps focused on speed, accessibility, and UX.",
                icon: "fa-code"
            },
            {
                name: "Firebase Systems",
                description: "Realtime databases, auth, storage, and scalable cloud functions.",
                icon: "fa-fire"
            },
            {
                name: "GitHub Hosting",
                description: "CI/CD, Pages, Actions, and modern deployment pipelines.",
                icon: "fa-github"
            },
            {
                name: "UI/UX Design",
                description: "Clean, intuitive interfaces with user-first design principles.",
                icon: "fa-palette"
            },
            {
                name: "Domain & DNS",
                description: "Cloudflare optimization, SSL, routing, and DNS best practices.",
                icon: "fa-globe"
            },
            {
                name: "Online Tools",
                description: "Custom tool development tailored to specific workflows.",
                icon: "fa-tools"
            }
        ],
        projects: [
            {
                name: "Online Tools Suite",
                description: "17+ tools including converters and generators with smooth UX and animations.",
                technologies: ["HTML/CSS", "JavaScript", "PDF.js"],
                link: "tools.html"
            },
            {
                name: "E-commerce Platform",
                description: "Full-featured e-commerce with payments, inventory, and admin dashboard.",
                technologies: ["Firebase", "JavaScript", "Payments"],
                link: "#"
            },
            {
                name: "AI Content Generator",
                description: "Multi-template content generation with customization and export.",
                technologies: ["AI API", "React", "Node"],
                link: "#"
            }
        ],
        contact: {
            email: "kcaarun10@gmail.com",
            whatsapp: "+977 98-10975653",
            whatsappLink: "https://wa.link/0mmt5c",
            facebook: "https://www.facebook.com/aruna.regmi.262052",
            instagram: "https://www.instagram.com/arunregmi.com.np/"
        }
    });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message, subject } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required'
        });
    }
    
    // Log the contact (in production, you'd send email or save to database)
    console.log('Contact form submission:', {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    });
    
    // Here you would typically:
    // 1. Send email using nodemailer or similar
    // 2. Save to database
    // 3. Send notification
    
    res.json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.'
    });
});

// AI Chat endpoint
app.post('/api/ai-chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message is required'
        });
    }
    
    try {
        // Try Groq API first
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: "You are a helpful AI assistant on arunregmi.com.np. Be concise and helpful. If asked for contact, use only: Email: kcaarun10@gmail.com and WhatsApp: +977 98-10975653. Do not mention LinkedIn. You are representing Arun Regmi, a web developer from Nepal."
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 800,
                temperature: 0.7,
                stream: false
            })
        });

        if (groqResponse.ok) {
            const data = await groqResponse.json();
            const aiResponse = data?.choices?.[0]?.message?.content;
            
            res.json({
                success: true,
                response: aiResponse
            });
            return;
        }
        
        // If Groq fails, use fallback responses
        const responses = {
            'services': 'I offer web development, Firebase systems, UI/UX design, GitHub hosting, domain & DNS setup, and custom online tools development.',
            'projects': 'I\'ve built an Online Tools Suite with 17+ tools, an E-commerce Platform, and an AI Content Generator. You can check out the tools page!',
            'contact': 'You can reach me via email at kcaarun10@gmail.com or WhatsApp at +977 98-10975653. The links are in the contact section!',
            'technologies': 'I work with HTML/CSS, JavaScript, React/Vue, Firebase, Node.js, Express, GitHub, Cloudflare, and focus on UI/UX, performance, and SEO.',
            'price': 'For pricing details, please contact me directly via email or WhatsApp with your project requirements. I provide custom quotes based on project scope.',
            'experience': 'I\'m a web developer focused on creating fast, modern, and accessible web experiences with expertise in frontend and backend technologies.'
        };
        
        let response = 'Thank you for your message! For specific inquiries about my services, projects, or to discuss your project needs, please contact me directly at kcaarun10@gmail.com or WhatsApp +977 98-10975653.';
        
        const lowerMessage = message.toLowerCase();
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }
        
        res.json({
            success: true,
            response
        });
        
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, I encountered an error. Please try again or contact me directly.'
        });
    }
});

// Serve main HTML file for all other routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Portfolio available at: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${NODE_ENV}`);
    if (NODE_ENV === 'production') {
        console.log(`🌍 Ready for production deployment on arunregmi.com.np`);
    }
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
