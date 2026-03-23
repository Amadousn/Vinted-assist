const BACKEND_URL = 'http://localhost:3000';
const MAX_IMAGES = 30;

let uploadedImages = [];
let generatedImages = [];
let currentGenerationType = null;

const PROMPT_CARRELAGE = `Create an ultra-realistic amateur-style product photo of the clothing item(s) I provide laid flat naturally on a tiled floor.

IMPORTANT: If the image shows a complete outfit/set (like a tracksuit with top and bottom, or matching pieces), display ALL pieces together in the photo, arranged naturally as a coordinated set.

The floor must look 100% real, like a normal apartment floor — light beige or neutral ceramic tiles, slightly matte finish, with thin grout lines and soft daylight reflection. The carrelage should feel authentic and lived-in, not studio-perfect.

The photo must look like it was taken casually at home with an iPhone 15 Pro, under natural daylight from a nearby window (soft side lighting, gentle shadows, no harsh contrast).

The garment should lie flat but not perfectly symmetrical, with light wrinkles and texture visible to show the fabric's real feel.

Camera angle: slightly above the ground (not perfectly top-down), as if someone leaned over to take the picture by hand.

Lens style: realistic iPhone 15 Pro perspective (wide but natural).

IMAGE QUALITY:
- Sharp, high-resolution photo
- Clear focus on the entire garment
- Visible fabric textures and details
- Accurate, vibrant colors
- Professional quality with natural lighting

No walls, no background props, no editing filters — only the clothing item(s) and the tiled floor.

If multiple pieces are shown (tracksuit, matching set, coordinated outfit), arrange them together naturally on the floor as they would be displayed for sale.

Ensure realistic color tones, natural shadows, and authentic lighting like a genuine amateur photo taken in a home environment. The goal is to keep the same background with no sunlight.`;

const PROMPT_BOIS = `The provided image is a reference for the clothing item(s) ONLY. Whether the garment is shown flat, on a mannequin, worn by a person, or on any background — ignore everything except the garment itself. Extract only the clothing item's design: shape, cut, fabric, color, pattern, and details.

IMPORTANT: If the image shows a complete outfit/set (like a tracksuit with top and bottom, matching pieces, or coordinated set), extract ALL pieces and display them together.

Create an ultra-realistic amateur-style product photo of this clothing item(s) laid flat naturally on an oak parquet floor.

The floor must look 100% real, like a normal apartment floor — natural light oak parquet planks with visible wood grain, slightly matte finish, with subtle seams between boards and soft daylight reflection. The parquet should feel authentic and lived-in, not studio-perfect, matching the appearance of a natural oak wooden floor.

The photo must look like it was taken casually at home with an iPhone 15 Pro, under natural daylight from a nearby window (soft side lighting, gentle shadows, no harsh contrast).

The garment should lie flat but not perfectly symmetrical, with light wrinkles and texture visible to show the fabric's real feel.

Camera angle: slightly above the ground (not perfectly top-down), as if someone leaned over to take the picture by hand.

Lens style: realistic iPhone 15 Pro perspective (wide but natural).

IMAGE QUALITY:
- Sharp, high-resolution photo
- Clear focus on the entire garment
- Visible fabric textures and details
- Accurate, vibrant colors
- Professional quality with natural lighting

Only the clothing item(s) and the oak parquet floor must be visible. No person, no mannequin, no walls, no background props, no editing filters.

If multiple pieces are shown (tracksuit, matching set, coordinated outfit), arrange them together naturally on the floor as a complete set, with pieces positioned close to each other to show they belong together.

Keep the floor evenly lit with soft ambient daylight only, with no direct sunlight, no sun patches, no strong highlights, and no dramatic shadows.`;

const PROMPT_VINYL = `The provided image is a reference for the clothing item(s) ONLY. Whether the garment is shown flat, on a mannequin, worn by a person, or on any background — ignore everything except the garment itself. Extract only the clothing item's design: shape, cut, fabric, color, pattern, and details.

IMPORTANT: If the image shows a complete outfit/set (like a tracksuit with top and bottom, matching pieces, or coordinated set), extract ALL pieces and display them together.

Create an ultra-realistic amateur-style product photo of this clothing item(s) laid flat naturally on a grey vinyl wood floor.

The floor must look 100% real, like a normal apartment floor — grey vinyl wood planks with subtle wood grain texture, slightly matte finish, with visible seams between planks and soft daylight reflection. The flooring should feel authentic and lived-in, not studio-perfect, resembling modern grey vinyl plank flooring commonly found in apartments.

The photo must look like it was taken casually at home with an iPhone 15 Pro, under natural daylight from a nearby window (soft side lighting, gentle shadows, no harsh contrast).

The garment should lie flat but not perfectly symmetrical, with light wrinkles and texture visible to show the fabric's real feel.

Camera angle: slightly above the ground (not perfectly top-down), as if someone leaned over to take the picture by hand.

Lens style: realistic iPhone 15 Pro perspective (wide but natural).

IMAGE QUALITY:
- Sharp, high-resolution photo
- Clear focus on the entire garment
- Visible fabric textures and details
- Accurate, vibrant colors
- Professional quality with natural lighting

Only the clothing item(s) and the grey vinyl wood floor must be visible. No person, no mannequin, no walls, no background props, no editing filters.

If multiple pieces are shown (tracksuit, matching set, coordinated outfit), arrange them together naturally on the floor as a complete set, with pieces positioned close to each other to show they belong together.

Keep the floor evenly lit with soft ambient daylight only, with no direct sunlight, no sun patches, no strong highlights, and no dramatic shadows.`;

const PROMPT_DESCRIPTION = `Tu es mon assistant pour créer des fiches Vinted pour un compte particulier. Je veux une fiche simple, naturelle, sans phrases commerciales, mais avec un titre ULTRA SEO avec plusieurs mots-clés. Tu dois toujours suivre exactement cette structure :

1️⃣ TITRE (ULTRA SEO) – Une seule ligne – Format obligatoire : Nom du vêtement + couleur + 4 à 7 mots-clés séparés par "/" – Exemple : Veste noire effet cuir / streetwear / oversize / urban look / tendance

2️⃣ DESCRIPTION (style particulier) – Ligne 1 : Taille M – Ligne 2 : Une phrase simple sur la coupe / style – Ligne 3 : Une phrase simple sur l'état – Ligne 4 : (optionnel) petit détail utile

3️⃣ MENSURATIONS TAILLE M – Tu inventes des mensurations cohérentes selon le type de vêtement – Jamais "environ" ni "approximatif" – Pour les hauts : Longueur / Poitrine / Épaules / Manches – Pour les bas : Taille / Hanches / Longueur

4️⃣ 80 HASHTAGS MULTILINGUES SEO – Tous sur une seule ligne – FR + EN + ES + DE + IT + PT + NL – Pas de marques – Pas de hashtags techniquement pro – Ajoute un nom de marque inventé à la fin

Réponds uniquement avec la fiche finale, sans aucun titre de section, sans numérotation, sans "TITRE:", sans "DESCRIPTION:", sans "MENSURATIONS:", sans "HASHTAGS:". Juste le contenu brut directement, prêt à copier-coller.

Analyse l'image du vêtement que je t'envoie et génère la fiche correspondante.`;

const PROMPT_DESCRIPTION_L = `Tu es mon assistant pour créer des fiches Vinted pour un compte particulier. Tu dois générer une fiche pour une taille L UNIQUEMENT. Je veux une fiche simple, naturelle, sans phrases commerciales, mais avec un titre ULTRA SEO avec plusieurs mots-clés. Tu dois toujours suivre exactement cette structure et NE JAMAIS mentionner d'autres tailles (S, M, XL, etc.) :

1️⃣ TITRE (ULTRA SEO) – Une seule ligne – Format obligatoire : Nom du vêtement + couleur + 4 à 7 mots-clés séparés par "/" – Exemple : Veste noire effet cuir / streetwear / oversize / urban look / tendance

2️⃣ DESCRIPTION (style particulier) – Ligne 1 : Taille L UNIQUEMENT – Ligne 2 : Une phrase simple sur la coupe / style – Ligne 3 : Une phrase simple sur l'état – Ligne 4 : (optionnel) petit détail utile. ATTENTION : Ne mentionne jamais d'autres tailles comme S, M, XL. Uniquement Taille L.

3️⃣ MENSURATIONS UNIQUEMENT POUR TAILLE L – Tu inventes des mensurations cohérentes pour une taille L – Jamais "environ" ni "approximatif" – Pour les hauts : Longueur / Poitrine / Épaules / Manches – Pour les bas : Taille / Hanches / Longueur. ATTENTION : Mensurations adaptées uniquement à la taille L. Pas de fourchette de tailles.

4️⃣ 80 HASHTAGS MULTILINGUES SEO – Tous sur une seule ligne – FR + EN + ES + DE + IT + PT + NL – Pas de marques – Pas de hashtags techniquement pro – Ajoute un nom de marque inventé à la fin

Réponds uniquement avec la fiche finale, sans aucun titre de section, sans numérotation, sans "TITRE:", sans "DESCRIPTION:", sans "MENSURATIONS:", sans "HASHTAGS:". Juste le contenu brut directement, prêt à copier-coller.

Analyse l'image du vêtement que je t'envoie et génère la fiche correspondante.`;

const PROMPT_MODELE = `STRICT IMAGE EDIT

You are given 2 images.

IMAGE 1 = BASE TEMPLATE
IMAGE 2 = DRESS REFERENCE

TASK:
Edit IMAGE 1 only.
The final output must be IMAGE 1 with the mannequin wearing the dress from IMAGE 2.

MANDATORY EDIT:
The mannequin in IMAGE 1 must be fully dressed with the COMPLETE garment from IMAGE 2.
The FULL garment must be visible on the mannequin — from neckline all the way down to its full length (ankles, knees, or wherever the garment ends in IMAGE 2).
Do not leave the mannequin undressed or partially dressed.
Do not show only part of the garment — show the ENTIRE garment as it appears in IMAGE 2.
Do not keep the original mannequin body visible where the garment should cover it.
If the garment in IMAGE 2 is a long dress, the mannequin must wear a long dress. If it is a short dress, the mannequin must wear a short dress. Match the exact length.

LOCKED ELEMENTS FROM IMAGE 1:
- keep the same room
- keep the same walls
- keep the same bed
- keep the same bedside table and lamp
- keep the same chair and cardigan
- keep the same wooden floor
- keep the same lighting
- keep the same camera angle
- keep the same framing
- keep the same mannequin
- keep the mannequin in the exact same position and size

DRESS TRANSFER FROM IMAGE 2:
Use only the dress from IMAGE 2:
- same color
- same fabric
- same shape
- same cut
- same neckline
- same straps or sleeves
- same length
- same drape

IGNORE from IMAGE 2:
- background
- floor
- walls
- mannequin
- lighting
- camera angle
- any other object

ABSOLUTE RULES:
- exactly one mannequin
- no extra mannequin
- no missing mannequin
- no empty mannequin
- no new room
- no change of floor
- no change of furniture
- no zoom
- no crop change

SUCCESS CONDITION:
The final image must show the mannequin from IMAGE 1 wearing the dress from IMAGE 2 inside the unchanged room from IMAGE 1.

FAILURE CONDITIONS:
- mannequin remains naked
- second mannequin appears
- room changes
- floor changes
- camera changes
- dress is missing`;

// Drag and Drop
const dropZone = document.getElementById('dropZone');
const imageUpload = document.getElementById('imageUpload');

dropZone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') imageUpload.click();
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleImageUpload(files);
});

imageUpload.addEventListener('change', (e) => {
    handleImageUpload(Array.from(e.target.files));
});

function handleImageUpload(files) {
    const remaining = MAX_IMAGES - uploadedImages.length;
    const toAdd = files.slice(0, remaining);
    
    if (files.length > remaining) {
        alert(`Max ${MAX_IMAGES} images. ${remaining} ajoutées.`);
    }
    
    toAdd.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = {
                file, dataUrl: e.target.result,
                base64: e.target.result.split(',')[1],
                id: Date.now() + i
            };
            uploadedImages.push(img);
            addImagePreview(img);
            updateUI();
        };
        reader.readAsDataURL(file);
    });
}

function addImagePreview(img) {
    const grid = document.getElementById('previewGrid');
    const section = document.getElementById('previewSection');
    
    const div = document.createElement('div');
    div.className = 'image-preview rounded-lg overflow-hidden';
    div.dataset.id = img.id;
    div.innerHTML = `
        <img src="${img.dataUrl}" class="w-full h-20 object-cover" />
        <div class="remove-btn" onclick="removeImage(${img.id})">✕</div>
    `;
    
    grid.appendChild(div);
    section.classList.remove('hidden');
}

function removeImage(id) {
    uploadedImages = uploadedImages.filter(img => img.id !== id);
    document.querySelector(`[data-id="${id}"]`)?.remove();
    if (!uploadedImages.length) document.getElementById('previewSection').classList.add('hidden');
    updateUI();
}

function clearAllImages() {
    uploadedImages = [];
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('previewSection').classList.add('hidden');
    updateUI();
}

function updateUI() {
    const n = uploadedImages.length;
    document.getElementById('imageCount').textContent = `${n} / 30`;
    document.getElementById('generateCarrelageBtn').disabled = n === 0;
    document.getElementById('generateBoisBtn').disabled = n === 0;
    document.getElementById('generateVinylBtn').disabled = n === 0;
    document.getElementById('generateModeleBtn').disabled = n === 0;
}

// Crop the top part of image (head/face) to avoid Gemini safety filters
function cropImageBase64(base64Data, mimeType) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const cropTop = Math.floor(img.height * 0.25);
            const newHeight = img.height - cropTop;
            canvas.width = img.width;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, cropTop, img.width, newHeight, 0, 0, img.width, newHeight);
            const croppedDataUrl = canvas.toDataURL(mimeType || 'image/jpeg', 0.95);
            resolve(croppedDataUrl.split(',')[1]);
        };
        img.src = `data:${mimeType};base64,${base64Data}`;
    });
}

// --- Image Generation ---
async function generateImages(type) {
    if (!uploadedImages.length) return;

    currentGenerationType = type;
    generatedImages = [];
    
    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('generateCarrelageBtn').disabled = true;
    document.getElementById('generateBoisBtn').disabled = true;
    document.getElementById('generateVinylBtn').disabled = true;
    document.getElementById('generateModeleBtn').disabled = true;
    document.getElementById('resultsSection').classList.add('hidden');
    
    const total = uploadedImages.length;
    let done = 0;

    // For modele and bois types: analyze garments first, then generate
    if (type === 'modele' || type === 'bois') {
        console.log('� Analyse de tous les vêtements...');
        
        const analyzePromises = uploadedImages.map(async (imageData) => {
            try {
                const res = await fetch(`${BACKEND_URL}/analyze-garment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageData: { mimeType: imageData.file.type, base64: imageData.base64 }
                    })
                });
                if (!res.ok) throw new Error('Erreur analyse');
                const data = await res.json();
                return { imageData, description: data.description };
            } catch (err) {
                console.error('Erreur analyse:', err);
                return { imageData, description: null, error: err.message };
            }
        });
        
        const analyzed = await Promise.all(analyzePromises);
        console.log('✅ Analyses terminées, génération des images et descriptions...');
        
        const generatePromises = analyzed.map(async ({ imageData, description, error }) => {
            if (error || !description) {
                done++;
                updateProgress(done, total);
                return { original: imageData.dataUrl, generated: null, error: error || 'Analyse échouée', type, description: null };
            }
            
            try {
                const [url, vintedDesc] = await Promise.all([
                    type === 'modele' 
                        ? callGeminiModelWithDescription(description)
                        : callGeminiBoisWithDescription(description),
                    generateSingleDescription(imageData)
                ]);
                done++;
                updateProgress(done, total);
                return { original: imageData.dataUrl, generated: url, type, description: vintedDesc };
            } catch (err) {
                console.error('Erreur génération:', err);
                done++;
                updateProgress(done, total);
                return { original: imageData.dataUrl, generated: null, error: err.message, type, description: null };
            }
        });
        
        generatedImages = await Promise.all(generatePromises);
    } else {
        // For carrelage and vinyl: generate images and descriptions in parallel
        const promises = uploadedImages.map(async (imageData) => {
            try {
                const prompt = type === 'carrelage' ? PROMPT_CARRELAGE : PROMPT_VINYL;
                
                // Generate image and Vinted description in parallel
                const [url, vintedDesc] = await Promise.all([
                    (async () => {
                        try {
                            return await callGeminiImage(prompt, imageData);
                        } catch (firstErr) {
                            console.log('⚠️ Premier essai échoué, recadrage sans visage...');
                            const croppedBase64 = await cropImageBase64(imageData.base64, imageData.file.type);
                            const croppedData = { ...imageData, base64: croppedBase64 };
                            return await callGeminiImage(prompt, croppedData);
                        }
                    })(),
                    generateSingleDescription(imageData)
                ]);
                
                done++;
                updateProgress(done, total);
                return { original: imageData.dataUrl, generated: url, type, description: vintedDesc };
            } catch (err) {
                console.error('Erreur:', err);
                done++;
                updateProgress(done, total);
                return { original: imageData.dataUrl, generated: null, error: err.message, type, description: null };
            }
        });
        
        generatedImages = await Promise.all(promises);
    }

    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('generateCarrelageBtn').disabled = false;
    document.getElementById('generateBoisBtn').disabled = false;
    document.getElementById('generateVinylBtn').disabled = false;
    document.getElementById('generateModeleBtn').disabled = false;
    displayResults();
}

function updateProgress(done, total) {
    document.getElementById('progressBar').style.width = `${(done / total) * 100}%`;
    document.getElementById('progressText').textContent = `${done} / ${total}`;
}

async function callGeminiImage(prompt, imageData) {
    const res = await fetch(`${BACKEND_URL}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            imageData: { mimeType: imageData.file.type, base64: imageData.base64 }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
    }

    const data = await res.json();
    
    // Log détaillé pour debug
    const candidate = data.candidates?.[0];
    if (!candidate) {
        console.error('❌ Pas de candidate. promptFeedback:', data.promptFeedback);
        throw new Error('Génération bloquée par Gemini');
    }
    
    const finishReason = candidate.finishReason;
    console.log(`📊 finishReason: ${finishReason}`);
    
    if (finishReason === 'SAFETY') {
        console.error('❌ Bloqué par filtres de sécurité');
        throw new Error('Image bloquée par filtres de sécurité');
    }
    
    if (finishReason === 'RECITATION') {
        console.error('❌ Bloqué pour récitation');
        throw new Error('Contenu bloqué (récitation)');
    }
    
    if (finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
        console.error(`❌ finishReason inattendu: ${finishReason}`);
    }
    
    if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
            const d = part.inline_data || part.inlineData;
            if (d) {
                const blob = base64ToBlob(d.data, d.mime_type || d.mimeType || 'image/png');
                return URL.createObjectURL(blob);
            }
        }
    }
    
    console.error('❌ Aucune image dans parts:', candidate.content?.parts?.length || 0, 'parts');
    throw new Error('Aucune image générée');
}

async function callGeminiModelWithImage(imageData) {
    const res = await fetch(`${BACKEND_URL}/generate-model-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imageData: { mimeType: imageData.file.type, base64: imageData.base64 }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
    }

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            const d = part.inline_data || part.inlineData;
            if (d) {
                const blob = base64ToBlob(d.data, d.mime_type || d.mimeType || 'image/png');
                return URL.createObjectURL(blob);
            }
        }
    }
    throw new Error('Aucune image dans la réponse');
}

async function callGeminiModelWithDescription(description) {
    const res = await fetch(`${BACKEND_URL}/generate-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
    }

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            const d = part.inline_data || part.inlineData;
            if (d) {
                const blob = base64ToBlob(d.data, d.mime_type || d.mimeType || 'image/png');
                return URL.createObjectURL(blob);
            }
        }
    }
    throw new Error('Aucune image dans la réponse');
}

async function callGeminiBoisWithDescription(description) {
    const res = await fetch(`${BACKEND_URL}/generate-bois`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
    }

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            const d = part.inline_data || part.inlineData;
            if (d) {
                const blob = base64ToBlob(d.data, d.mime_type || d.mimeType || 'image/png');
                return URL.createObjectURL(blob);
            }
        }
    }
    throw new Error('Aucune image dans la réponse');
}

function base64ToBlob(b64, mime) {
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

// --- Description Generation ---
async function generateAllDescriptions(size = 'M') {
    const btnId = size === 'L' ? 'generateDescLBtn' : 'generateDescBtn';
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Génération...`;

    const prompt = size === 'L' ? PROMPT_DESCRIPTION_L : PROMPT_DESCRIPTION;

    for (let i = 0; i < generatedImages.length; i++) {
        const result = generatedImages[i];
        if (!result.generated) continue;

        const descBox = document.getElementById(`desc-${i}`);
        const copyBtn = document.getElementById(`copy-${i}`);
        
        if (descBox) {
            descBox.textContent = 'Génération de la description...';
            descBox.classList.remove('hidden');
        }

        try {
            const desc = await callGeminiDescription(result.original, prompt);
            result.description = desc;
            if (descBox) descBox.textContent = desc;
            if (copyBtn) copyBtn.classList.remove('hidden');
        } catch (err) {
            console.error('Erreur desc:', err);
            if (descBox) descBox.textContent = 'Erreur: ' + err.message;
        }
    }

    btn.disabled = false;
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg> Descriptions Taille ${size}`;
}

async function generateSingleDescription(imageData, size = 'M') {
    const prompt = size === 'L' ? PROMPT_DESCRIPTION_L : PROMPT_DESCRIPTION;
    try {
        const res = await fetch(`${BACKEND_URL}/generate-description`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                imageData: { mimeType: imageData.file.type, base64: imageData.base64 }
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || res.statusText);
        }

        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
                if (part.text) return part.text.trim();
            }
        }
        throw new Error('Pas de description générée');
    } catch (err) {
        console.error('Erreur description:', err);
        return null;
    }
}

async function callGeminiDescription(imageDataUrl, prompt = PROMPT_DESCRIPTION) {
    const base64 = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1];

    const res = await fetch(`${BACKEND_URL}/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: prompt,
            imageData: { mimeType, base64 }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
    }

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part.text) return part.text.trim();
        }
    }
    throw new Error('Pas de description générée');
}

function copyDescription(index) {
    const desc = generatedImages[index]?.description;
    if (!desc) return;
    
    navigator.clipboard.writeText(desc).then(() => {
        const toast = document.getElementById('copyToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });
}

// --- Display Results ---
function displayResults() {
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = '';
    
    generatedImages.forEach((result, i) => {
        const card = document.createElement('div');
        card.className = 'glass-light rounded-xl overflow-hidden fade-in';
        card.style.animationDelay = `${i * 0.08}s`;
        
        if (result.generated) {
            card.innerHTML = `
                <div class="relative">
                    <img src="${result.generated}" class="w-full h-56 object-cover" />
                    <span class="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${result.type === 'carrelage' ? 'bg-orange-500/90' : result.type === 'bois' ? 'bg-zinc-600/90' : result.type === 'vinyl' ? 'bg-slate-500/90' : 'bg-pink-600/90'} text-white">
                        ${result.type === 'carrelage' ? '🏠 Carrelage' : result.type === 'bois' ? '🪵 Chêne' : result.type === 'vinyl' ? '🩶 Vinyl' : '👗 Modèle'}
                    </span>
                </div>
                <div class="p-4 space-y-3">
                    <button onclick="downloadSingleImage(${i})" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                        Télécharger
                    </button>
                    <div id="desc-${i}" class="desc-box p-3 ${result.description ? '' : 'hidden'}">${result.description || ''}</div>
                    <button id="copy-${i}" onclick="copyDescription(${i})" class="${result.description ? '' : 'hidden'} w-full bg-violet-600 hover:bg-violet-500 text-white text-sm py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/></svg>
                        Copier la description
                    </button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="p-6 text-center">
                    <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                    </div>
                    <p class="text-sm text-zinc-500">${result.error}</p>
                </div>
            `;
        }
        
        grid.appendChild(card);
    });
    
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// --- Downloads ---
async function downloadSingleImage(index) {
    const result = generatedImages[index];
    if (!result?.generated) return;
    
    const res = await fetch(result.generated);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vinted_${result.type}_${index + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function downloadAllImages() {
    for (let i = 0; i < generatedImages.length; i++) {
        if (generatedImages[i].generated) {
            await downloadSingleImage(i);
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

// --- Reset ---
function resetApp() {
    generatedImages.forEach(r => { if (r.generated) URL.revokeObjectURL(r.generated); });
    uploadedImages = [];
    generatedImages = [];
    currentGenerationType = null;
    
    document.getElementById('imageUpload').value = '';
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('resultsGrid').innerHTML = '';
    
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
