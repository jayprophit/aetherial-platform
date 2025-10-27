import { useState } from 'react';
import { 
  User, Camera, Upload, Download, Shuffle, Save, 
  ChevronRight, ChevronLeft, Palette, Ruler, Shirt, 
  Eye, Smile, Scissors, Star, X
} from 'lucide-react';

interface CharacterConfig {
  // Body
  height: number;
  bodyType: 'slim' | 'athletic' | 'muscular' | 'plus-size';
  shoulderWidth: number;
  
  // Face
  faceShape: string;
  eyeShape: string;
  eyeColor: string;
  eyeSize: number;
  noseSize: number;
  mouthSize: number;
  
  // Hair
  hairstyle: string;
  hairColor: string;
  facialHair: string;
  
  // Skin & Outfit
  skinTone: string;
  outfit: string;
  outfitColor: string;
  
  // Accessories
  glasses: string;
  accessories: string[];
}

const defaultConfig: CharacterConfig = {
  height: 1.0,
  bodyType: 'athletic',
  shoulderWidth: 1.0,
  faceShape: 'oval',
  eyeShape: 'almond',
  eyeColor: '#4A90E2',
  eyeSize: 1.0,
  noseSize: 1.0,
  mouthSize: 1.0,
  hairstyle: 'short',
  hairColor: '#2C1810',
  facialHair: 'none',
  skinTone: '#F5D6C6',
  outfit: 'casual',
  outfitColor: '#3B82F6',
  glasses: 'none',
  accessories: [],
};

const tabs = [
  { id: 'body', label: 'Body', icon: User },
  { id: 'face', label: 'Face', icon: Smile },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'outfit', label: 'Outfit', icon: Shirt },
  { id: 'photo', label: 'Photo AI', icon: Camera },
];

const bodyTypes = [
  { id: 'slim', label: 'Slim', emoji: '🏃' },
  { id: 'athletic', label: 'Athletic', emoji: '💪' },
  { id: 'muscular', label: 'Muscular', emoji: '🦾' },
  { id: 'plus-size', label: 'Plus Size', emoji: '🤗' },
];

const faceShapes = [
  { id: 'oval', label: 'Oval' },
  { id: 'round', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'heart', label: 'Heart' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'triangle', label: 'Triangle' },
];

const hairstyles = [
  { id: 'short', label: 'Short', emoji: '👨' },
  { id: 'medium', label: 'Medium', emoji: '👨‍🦱' },
  { id: 'long', label: 'Long', emoji: '👨‍🦰' },
  { id: 'bald', label: 'Bald', emoji: '👨‍🦲' },
  { id: 'ponytail', label: 'Ponytail', emoji: '👱' },
  { id: 'mohawk', label: 'Mohawk', emoji: '🎸' },
];

const outfits = [
  { id: 'casual', label: 'Casual', emoji: '👕' },
  { id: 'formal', label: 'Formal', emoji: '👔' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🗡️' },
  { id: 'superhero', label: 'Superhero', emoji: '🦸' },
];

interface CharacterCustomizerProps {
  onSave: (config: CharacterConfig) => void;
  onClose: () => void;
}

export default function CharacterCustomizer({ onSave, onClose }: CharacterCustomizerProps) {
  const [activeTab, setActiveTab] = useState('body');
  const [config, setConfig] = useState<CharacterConfig>(defaultConfig);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const updateConfig = (key: keyof CharacterConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // TODO: Call AI API to generate avatar from photo
      console.log('Photo uploaded:', file.name);
    }
  };

  const randomize = () => {
    const randomConfig: CharacterConfig = {
      height: 0.8 + Math.random() * 0.4,
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)].id as any,
      shoulderWidth: 0.8 + Math.random() * 0.4,
      faceShape: faceShapes[Math.floor(Math.random() * faceShapes.length)].id,
      eyeShape: 'almond',
      eyeColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      eyeSize: 0.8 + Math.random() * 0.4,
      noseSize: 0.8 + Math.random() * 0.4,
      mouthSize: 0.8 + Math.random() * 0.4,
      hairstyle: hairstyles[Math.floor(Math.random() * hairstyles.length)].id,
      hairColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      facialHair: Math.random() > 0.5 ? 'beard' : 'none',
      skinTone: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      outfit: outfits[Math.floor(Math.random() * outfits.length)].id,
      outfitColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      glasses: Math.random() > 0.7 ? 'round' : 'none',
      accessories: [],
    };
    setConfig(randomConfig);
  };

  const renderBodyTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Body Type</label>
        <div className="grid grid-cols-2 gap-3">
          {bodyTypes.map(type => (
            <button
              key={type.id}
              onClick={() => updateConfig('bodyType', type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.bodyType === type.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="text-3xl mb-2">{type.emoji}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Height: {(config.height * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={config.height}
          onChange={(e) => updateConfig('height', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Shoulder Width: {(config.shoulderWidth * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={config.shoulderWidth}
          onChange={(e) => updateConfig('shoulderWidth', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );

  const renderFaceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Face Shape</label>
        <div className="grid grid-cols-3 gap-2">
          {faceShapes.map(shape => (
            <button
              key={shape.id}
              onClick={() => updateConfig('faceShape', shape.id)}
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                config.faceShape === shape.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Eye Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.eyeColor}
            onChange={(e) => updateConfig('eyeColor', e.target.value)}
            className="w-16 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{config.eyeColor}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Eye Size: {(config.eyeSize * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={config.eyeSize}
          onChange={(e) => updateConfig('eyeSize', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Nose Size: {(config.noseSize * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={config.noseSize}
          onChange={(e) => updateConfig('noseSize', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Mouth Size: {(config.mouthSize * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={config.mouthSize}
          onChange={(e) => updateConfig('mouthSize', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Skin Tone</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.skinTone}
            onChange={(e) => updateConfig('skinTone', e.target.value)}
            className="w-16 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{config.skinTone}</span>
        </div>
      </div>
    </div>
  );

  const renderHairTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Hairstyle</label>
        <div className="grid grid-cols-3 gap-3">
          {hairstyles.map(style => (
            <button
              key={style.id}
              onClick={() => updateConfig('hairstyle', style.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.hairstyle === style.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="text-3xl mb-2">{style.emoji}</div>
              <div className="text-xs font-medium">{style.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Hair Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.hairColor}
            onChange={(e) => updateConfig('hairColor', e.target.value)}
            className="w-16 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{config.hairColor}</span>
        </div>
      </div>
    </div>
  );

  const renderOutfitTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Outfit Style</label>
        <div className="grid grid-cols-3 gap-3">
          {outfits.map(outfit => (
            <button
              key={outfit.id}
              onClick={() => updateConfig('outfit', outfit.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.outfit === outfit.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="text-3xl mb-2">{outfit.emoji}</div>
              <div className="text-xs font-medium">{outfit.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Outfit Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.outfitColor}
            onChange={(e) => updateConfig('outfitColor', e.target.value)}
            className="w-16 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{config.outfitColor}</span>
        </div>
      </div>
    </div>
  );

  const renderPhotoTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Camera className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h3 className="text-lg font-semibold mb-2">Photo to Avatar AI</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Upload your photo and let AI create your 3D avatar
        </p>
        
        <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
          <Upload className="w-5 h-5" />
          <span>Upload Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>

        {photoFile && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ Photo uploaded: {photoFile.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              AI is generating your avatar...
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-sm font-semibold mb-3">Tips for best results:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• Use a clear, front-facing photo</li>
          <li>• Good lighting is essential</li>
          <li>• Remove sunglasses and hats</li>
          <li>• Neutral expression works best</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left: 3D Preview */}
        <div className="w-1/2 bg-gradient-to-b from-gray-900 to-black p-6 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <User className="w-32 h-32 text-gray-600" />
              </div>
              <p className="text-sm text-gray-400">3D Preview (Live)</p>
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Character Creator</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'body' && renderBodyTab()}
            {activeTab === 'face' && renderFaceTab()}
            {activeTab === 'hair' && renderHairTab()}
            {activeTab === 'outfit' && renderOutfitTab()}
            {activeTab === 'photo' && renderPhotoTab()}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                onClick={randomize}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span className="text-sm font-medium">Randomize</span>
              </button>
              <button
                onClick={() => onSave(config)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">Save Avatar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

