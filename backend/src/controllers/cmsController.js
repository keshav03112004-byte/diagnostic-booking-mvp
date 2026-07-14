const SiteSettings = require('../models/SiteSettings');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSettings.create({ key: 'main' });
  } else {
    // Migrate old settings dynamically to match energex.life and new nurse-test.mp4 video
    let needsSave = false;
    if (settings.siteName === 'DiagBook' || !settings.siteName) {
      settings.siteName = 'energex.life';
      needsSave = true;
    }
    if (settings.badge === 'Trusted · At-Home · NABL Labs' || !settings.badge) {
      settings.badge = 'Accredited · At-Home Collection · Expert Analysis';
      needsSave = true;
    }
    if (settings.tagline === 'Your Health Deserves' || settings.tagline === 'Precision Health & Wellness with' || !settings.tagline) {
      settings.tagline = 'Advanced Diagnostics';
      needsSave = true;
    }
    if (settings.taglineHighlight === 'Care at Your Doorstep' || settings.taglineHighlight === 'Advanced Diagnostics at Home' || !settings.taglineHighlight) {
      settings.taglineHighlight = 'at Your Doorstep';
      needsSave = true;
    }
    if (settings.description?.startsWith('Book diagnostic tests in 2 minutes') || settings.description?.startsWith('Book diagnostic tests and full body scans') || !settings.description) {
      settings.description = 'Certified home sample collection from accredited labs. Accurate reports in 24 hours.';
      needsSave = true;
    }
    // Prefer local hero video over legacy remote/demo sources
    if (!settings.heroVideo) settings.heroVideo = {};
    const currentSrc = settings.heroVideo.src || '';
    if (
      !currentSrc ||
      currentSrc.includes('mixkit.co') ||
      currentSrc.includes('nurse-test.mp4')
    ) {
      settings.heroVideo.src = '/videos/hero-health.mp4';
      needsSave = true;
    }
    if (needsSave) {
      await settings.save();
    }
  }
  return settings;
};

exports.getHero = async (_req, res) => {
  const settings = await getOrCreateSettings();
  return res.json({
    siteName: settings.siteName,
    badge: settings.badge,
    tagline: settings.tagline,
    taglineHighlight: settings.taglineHighlight,
    description: settings.description,
    heroVideo: settings.heroVideo,
    heroStats: settings.heroStats,
    heroTags: settings.heroTags,
  });
};

exports.updateHero = async (req, res) => {
  const settings = await getOrCreateSettings();
  const fields = [
    'siteName',
    'badge',
    'tagline',
    'taglineHighlight',
    'description',
    'heroVideo',
    'heroStats',
    'heroTags',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  await settings.save();
  return res.json({ message: 'Hero content updated', settings });
};

exports.getAllSettings = async (_req, res) => {
  const settings = await getOrCreateSettings();
  return res.json({ settings });
};

exports.generateVideo = async (req, res) => {
  const { prompt, aspectRatio = '16:9', duration = '5s' } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GEMINI_API_KEY environment variable is not configured in secrets' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    console.log(`[Veo 3] Generating video for prompt: "${prompt}", ratio: ${aspectRatio}, duration: ${duration}`);
    
    const interaction = await ai.interactions.create({
      model: 'veo-3.1-fast-generate-preview',
      input: prompt,
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: aspectRatio,
        duration: duration,
      }
    }, { timeout: 300000 }); // 5 minutes timeout

    let videoData = null;
    if (interaction.output_video && interaction.output_video.data) {
      videoData = interaction.output_video.data;
    } else if (interaction.steps) {
      for (const step of interaction.steps) {
        if (step.type === 'model_output' && step.content) {
          const videoContent = step.content.find(c => c.type === 'video');
          if (videoContent && videoContent.data) {
            videoData = videoContent.data;
            break;
          }
        }
      }
    }

    if (!videoData) {
      console.error('[Veo 3] No video data returned from Veo 3 model:', JSON.stringify(interaction));
      return res.status(500).json({ message: 'No video data returned from Veo 3 model' });
    }

    const videoBuffer = Buffer.from(videoData, 'base64');
    
    // Ensure directories exist
    const uploadDir = path.join(__dirname, '../../uploads');
    const videoDir = path.join(uploadDir, 'videos');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    const filename = `veo3-ai-${Date.now()}.mp4`;
    const filePath = path.join(videoDir, filename);
    fs.writeFileSync(filePath, videoBuffer);

    const url = `/uploads/videos/${filename}`;
    console.log(`[Veo 3] Video saved successfully to ${filePath}. Accessible via ${url}`);

    return res.json({
      message: 'Video generated successfully using Veo 3',
      url,
      filename,
    });
  } catch (error) {
    console.error('[Veo 3] Error generating video:', error);
    return res.status(500).json({ 
      message: 'Failed to generate video using Veo 3', 
      error: error.message 
    });
  }
};
