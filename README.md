# 📸 Vinted Assistant - Générateur de Photos

Interface web simple pour générer des photos professionnelles de vêtements pour Vinted avec IA.

## 🎯 Fonctionnalités

- Upload d'image de vêtement
- Génération automatique de 2 versions avec Gemini Flash 2.5 :
  - **Fond carrelage beige** - Style appartement avec carrelage naturel
  - **Fond bois vinyle gris** - Style moderne avec plancher gris

## 🔑 Configuration

La clé API Gemini est déjà configurée dans le code. Vous pouvez commencer à utiliser l'application immédiatement !

Si vous souhaitez utiliser votre propre clé API :
1. Obtenez une clé API sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ouvrez `script.js` et remplacez la clé à la ligne 1

```javascript
const GEMINI_API_KEY = 'VotreCléAPIici';
```

## 🚀 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Uploadez une photo de votre vêtement
3. Cliquez sur "Générer les photos"
4. Attendez la génération (quelques secondes)
5. Téléchargez vos photos générées

## 🤖 API Utilisée

- **Gemini 2.0 Flash Experimental** avec génération d'images
- Génération d'images ultra-réalistes
- Style amateur iPhone 15 Pro
- Prompts optimisés pour photos Vinted

## 💡 Conseils

- Utilisez des photos claires de vos vêtements
- Privilégiez un fond neutre pour l'image d'origine
- Les photos générées auront un style amateur réaliste
- Lumière naturelle sans soleil direct
- Les deux versions sont générées en parallèle pour plus de rapidité

## 📝 Note

Les résultats sont générés par IA et peuvent varier. Si le résultat ne vous convient pas, vous pouvez régénérer.
