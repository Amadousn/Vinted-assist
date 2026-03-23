require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Gemini API - Clé depuis variable d'environnement
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

if (!API_KEY) {
    throw new Error('GEMINI_API_KEY manquante. Ajoute ta clé dans le fichier .env avec le format GEMINI_API_KEY=ta_nouvelle_cle');
}

const SAFETY_SETTINGS = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
];

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt, imageData } = req.body;
        
        console.log(`📸 Génération en cours...`);
        
        const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: imageData.mimeType,
                                data: imageData.base64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                },
                safetySettings: SAFETY_SETTINGS
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ API Error:', errorData.error?.message);
            return res.status(response.status).json({ 
                error: errorData.error?.message || 'API Error' 
            });
        }

        const data = await response.json();
        // Debug complet
        const candidate = data.candidates?.[0];
        if (candidate) {
            console.log(`📸 finishReason: ${candidate.finishReason}`);
            if (candidate.finishReason !== 'STOP') {
                console.log('📸 finishMessage:', candidate.finishMessage?.substring(0, 300));
            }
            const parts = candidate.content?.parts || [];
            const hasImage = parts.some(p => p.inline_data || p.inlineData);
            console.log(`📸 Réponse: ${parts.length} parts, image=${hasImage}`);
        } else {
            console.log('📸 Pas de candidates! promptFeedback:', JSON.stringify(data.promptFeedback));
        }
        res.json(data);
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour générer les descriptions (utilise le modèle texte)
const GEMINI_TEXT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/generate-description', async (req, res) => {
    try {
        const { prompt, imageData } = req.body;
        
        console.log(`📝 Génération description...`);
        
        const response = await fetch(`${GEMINI_TEXT_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: imageData.mimeType,
                                data: imageData.base64
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ API Error:', errorData.error?.message);
            return res.status(response.status).json({ 
                error: errorData.error?.message || 'API Error' 
            });
        }

        const data = await response.json();
        console.log('✅ Description générée');
        res.json(data);
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour analyser un vêtement et retourner sa description
app.post('/analyze-garment', async (req, res) => {
    try {
        const { imageData } = req.body;
        
        console.log(`🔍 Analyse du vêtement...`);
        
        const descPrompt = `You are a fashion expert. Analyze this garment image and provide an ULTRA-DETAILED technical description that captures EVERY visible detail. This description will be used to recreate the garment EXACTLY.

Describe with EXTREME PRECISION:

1. GARMENT TYPE & LENGTH:
   - Exact type (maxi dress, midi dress, mini dress, gown, cocktail dress, etc.)
   - Exact length measurement (floor-length, ankle-length, mid-calf, knee-length, above-knee, etc.)

2. COLORS (be hyper-specific):
   - Primary color with exact shade (burgundy, rose gold, navy, emerald, etc.)
   - Secondary colors if any
   - Color blocking or gradient if present
   - Metallic/shimmer/matte finish

3. FABRIC & TEXTURE:
   - Exact fabric type (sequined fabric, satin, chiffon, velvet, lace, tulle, crepe, etc.)
   - Texture (smooth, textured, ribbed, pleated, etc.)
   - Shine level (matte, satin, high-shine, metallic, glitter)
   - Weight (flowy, structured, heavy, lightweight)

4. SILHOUETTE & FIT:
   - Overall silhouette (A-line, bodycon, fit-and-flare, empire waist, mermaid, column, etc.)
   - How it fits the body (fitted bodice, loose skirt, etc.)
   - Waistline position (natural waist, empire, dropped, etc.)

5. NECKLINE (exact shape):
   - Type (V-neck, square, sweetheart, off-shoulder, halter, cowl, boat, scoop, etc.)
   - Depth (plunging, modest, etc.)

6. SLEEVES/STRAPS:
   - Type (sleeveless, spaghetti straps, cap sleeve, short sleeve, 3/4 sleeve, long sleeve, bishop sleeve, puff sleeve, etc.)
   - Details (ruched, gathered, fitted, etc.)

7. SKIRT/BOTTOM:
   - Shape (straight, A-line, full, pleated, tiered, etc.)
   - Details (slit and position, train, asymmetric hem, etc.)

8. CONSTRUCTION DETAILS:
   - Seams, panels, color blocking
   - Ruching, gathering, draping
   - Pleats, tucks, folds
   - Overlay or underlayer
   - Lining visible or not

9. EMBELLISHMENTS & DECORATIONS:
   - Sequins (all-over, partial, pattern)
   - Beading, embroidery, appliqués
   - Buttons, zippers (visible or hidden)
   - Belts, sashes, bows
   - Trim, piping, lace inserts

10. UNIQUE FEATURES:
    - Anything distinctive about this garment
    - Special design elements
    - Mixed fabrics or textures

Write ONLY the technical description. No introduction, no conclusion, no commentary. Be obsessively detailed. Every visible element must be described. Write in English.`;

        const response = await fetch(`${GEMINI_TEXT_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: descPrompt },
                        {
                            inline_data: {
                                mime_type: imageData.mimeType,
                                data: imageData.base64
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('❌ Erreur analyse:', err.error?.message);
            return res.status(response.status).json({ error: err.error?.message || 'Erreur analyse' });
        }

        const data = await response.json();
        const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!description) {
            return res.status(500).json({ error: 'Impossible d\'analyser le vêtement' });
        }
        
        console.log(`🔍 Description: ${description.substring(0, 150)}...`);
        res.json({ description });
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint bois : génère l'image à partir d'une description pré-calculée avec template-chene.jpg
const TEMPLATE_CHENE_PATH = path.join(__dirname, 'template-chene.jpg');

app.post('/generate-bois', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!fs.existsSync(TEMPLATE_CHENE_PATH)) {
            return res.status(400).json({ error: 'template-chene.jpg introuvable dans le dossier du projet' });
        }
        
        if (!description) {
            return res.status(400).json({ error: 'Description manquante' });
        }
        
        console.log(`🪵 Génération Chêne avec description: ${description.substring(0, 150)}...`);
        
        const templateBuffer = fs.readFileSync(TEMPLATE_CHENE_PATH);
        const templateBase64 = templateBuffer.toString('base64');
        
        const editPrompt = `Edit this photo. Replace the garment on the floor with the following garment:

${description}

Rules:
- Keep the EXACT same oak parquet floor (same wood grain, same color, same pattern, same lighting).
- Keep the exact same camera angle and framing.
- Only replace the garment - everything else must stay identical.
- The garment must lie flat on the floor naturally with realistic folds.
- Do not add any person, mannequin, walls, or other objects.
- The result must look like a real iPhone 16 Pro photo, sharp and crisp, not blurry.
- High resolution, sharp focus on the garment, visible fabric texture and details.
- Ultra realistic, natural lighting, no filters, no blur, no soft focus.`;

        const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: editPrompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: templateBase64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                },
                safetySettings: SAFETY_SETTINGS
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('❌ Erreur génération Chêne:', err.error?.message);
            return res.status(response.status).json({ error: err.error?.message || 'Erreur génération' });
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (candidate) {
            const parts = candidate.content?.parts || [];
            const hasImage = parts.some(p => p.inline_data || p.inlineData);
            console.log(`🪵 finishReason: ${candidate.finishReason}, parts: ${parts.length}, image: ${hasImage}`);
        } else {
            console.log('🪵 Pas de candidates!', JSON.stringify(data.promptFeedback));
        }
        res.json(data);
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint modèle : image-to-image direct (template + garment image)
const TEMPLATE_PATH = path.join(__dirname, 'template.jpg');

app.post('/generate-model-image', async (req, res) => {
    try {
        const { imageData } = req.body;
        
        if (!fs.existsSync(TEMPLATE_PATH)) {
            return res.status(400).json({ error: 'template.jpg introuvable dans le dossier du projet' });
        }
        
        console.log(`👗 Génération Modèle (image-to-image)...`);
        
        const templateBuffer = fs.readFileSync(TEMPLATE_PATH);
        const templateBase64 = templateBuffer.toString('base64');
        
        const prompt = `IMAGE EDITING TASK

IMAGE 1: A mannequin standing in a room
IMAGE 2: A dress/garment

TASK: Dress the mannequin from IMAGE 1 with the garment from IMAGE 2.

INSTRUCTIONS:

Step 1 - Start with IMAGE 1 as your base
- Keep everything from IMAGE 1: the room, walls, bed, furniture, floor, lighting
- Keep the SAME mannequin from IMAGE 1 (do not replace it, do not add another one)

Step 2 - Dress the mannequin
- Put the garment from IMAGE 2 onto the mannequin's body
- The garment must fit the mannequin's 3D body shape (wrap around torso, follow curves)
- The fabric must drape naturally on the mannequin

Step 3 - Match the garment exactly
- Use the EXACT same color, fabric, texture from IMAGE 2
- Use the EXACT same length (floor-length, knee-length, etc.)
- Use the EXACT same neckline shape (V-neck, sweetheart, square, etc.)
- Use the EXACT same sleeves (sleeveless, short, long, puff, etc.)
- Include ALL details: sequins, beading, embroidery, pleats, ruching, buttons, zippers, slits
- Do not change, add, or remove any detail

CRITICAL RULES:
- Final image must have ONLY ONE mannequin (the one from IMAGE 1)
- Do NOT add a second mannequin
- Do NOT copy/paste the flat garment - it must be fitted to the 3D body
- Keep the same room and environment from IMAGE 1
- Ultra realistic photo quality, sharp and crisp

OUTPUT: A photo of the mannequin from IMAGE 1 wearing the garment from IMAGE 2, in the same room.`;

        const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: templateBase64
                            }
                        },
                        {
                            inline_data: {
                                mime_type: imageData.mimeType,
                                data: imageData.base64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                },
                safetySettings: SAFETY_SETTINGS
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('❌ Erreur génération Modèle:', err.error?.message);
            return res.status(response.status).json({ error: err.error?.message || 'Erreur génération' });
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (candidate) {
            const parts = candidate.content?.parts || [];
            const hasImage = parts.some(p => p.inline_data || p.inlineData);
            console.log(`👗 finishReason: ${candidate.finishReason}, parts: ${parts.length}, image: ${hasImage}`);
        } else {
            console.log('👗 Pas de candidates!', JSON.stringify(data.promptFeedback));
        }
        res.json(data);
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint modèle : génère l'image à partir d'une description pré-calculée (legacy)
app.post('/generate-model', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!fs.existsSync(TEMPLATE_PATH)) {
            return res.status(400).json({ error: 'template.jpg introuvable dans le dossier du projet' });
        }
        
        if (!description) {
            return res.status(400).json({ error: 'Description manquante' });
        }
        
        console.log(`👗 Génération avec description: ${description.substring(0, 150)}...`);
        
        const templateBuffer = fs.readFileSync(TEMPLATE_PATH);
        const templateBase64 = templateBuffer.toString('base64');
        
        const editPrompt = `STRICT PHOTO EDIT - EXACT GARMENT REPLICATION

You must edit this photo by dressing the mannequin with the garment described below. The garment MUST be replicated EXACTLY as described with ZERO creative interpretation.

GARMENT TO REPLICATE (FOLLOW EXACTLY):
${description}

CRITICAL RULES - NO EXCEPTIONS:

1. GARMENT ACCURACY (ABSOLUTE PRIORITY):
   - Replicate EVERY detail from the description with 100% accuracy
   - Exact colors (no shade variations, no color shifts)
   - Exact fabric type and texture (sequins must be sequins, satin must be satin, etc.)
   - Exact length (floor-length must touch the floor, knee-length must stop at knee, etc.)
   - Exact silhouette and fit (bodycon must be fitted, A-line must flare, etc.)
   - Exact neckline shape (V-neck must be V-shaped, square must be square, etc.)
   - Exact sleeve type (sleeveless means NO sleeves, long sleeve means FULL length, etc.)
   - All embellishments must match (sequins, beading, embroidery, buttons, etc.)
   - All construction details must match (pleats, ruching, draping, seams, etc.)
   - If the description mentions a slit, belt, bow, or any detail, it MUST be present

2. ENVIRONMENT (KEEP IDENTICAL):
   - Keep the EXACT same room, walls, bed, furniture, wooden floor
   - Keep the EXACT same lighting (soft, natural, no changes)
   - Move the mannequin slightly closer to camera for better garment visibility
   - Mannequin must be centered and prominent

3. WHAT NOT TO CHANGE:
   - Do NOT add or remove any furniture or objects
   - Do NOT add a second mannequin
   - Do NOT change the garment colors or style
   - Do NOT simplify or omit any garment details
   - Do NOT add details not mentioned in the description

4. PHOTO QUALITY (CRITICAL - VINTED REQUIREMENTS):
   - ULTRA-HIGH RESOLUTION: 4K quality minimum
   - RAZOR-SHARP FOCUS: Every detail must be crystal clear with zero blur
   - PROFESSIONAL SHARPNESS: As if shot with a macro lens
   - PERFECT CLARITY: No motion blur, no soft focus, no haze, no fuzziness
   - FABRIC DETAILS: Every stitch, seam, texture, and weave must be perfectly visible
   - RICH COLORS: Accurate, vibrant color depth with no washed-out tones
   - HIGH DYNAMIC RANGE: Visible details in both shadows and highlights
   - GRAIN-FREE: Pristine, noise-free image quality
   - PIN-SHARP EDGES: Clean, crisp contours and outlines
   - VISIBLE EMBELLISHMENTS: All sequins, beads, buttons, lace must be clearly distinguishable
   - Ultra realistic iPhone 16 Pro photo quality
   - Natural lighting, no filters, no artificial effects

REMEMBER: Your ONLY job is to dress the mannequin with the EXACT garment described. Every single detail matters. The image MUST be ultra-sharp and professional quality to meet Vinted standards. Do not invent, do not simplify, do not approximate.`;

        const step2Response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: editPrompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: templateBase64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                },
                safetySettings: SAFETY_SETTINGS
            })
        });

        if (!step2Response.ok) {
            const err = await step2Response.json();
            console.error('❌ Étape 2 erreur:', err.error?.message);
            return res.status(step2Response.status).json({ error: err.error?.message || 'Erreur génération' });
        }

        const data = await step2Response.json();
        const candidate = data.candidates?.[0];
        if (candidate) {
            const parts = candidate.content?.parts || [];
            const hasImage = parts.some(p => p.inline_data || p.inlineData);
            console.log(`👗 finishReason: ${candidate.finishReason}, parts: ${parts.length}, image: ${hasImage}`);
        } else {
            console.log('👗 Pas de candidates!', JSON.stringify(data.promptFeedback));
        }
        res.json(data);
        
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static('.'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📸 Vinted Assistant Pro`);
    console.log(`   → /generate-image       : Gemini 2.5 Flash Image`);
    console.log(`   → /generate-model       : 2 étapes (texte → image)`);
    console.log(`   → /generate-description : Gemini 2.0 Flash`);
});
