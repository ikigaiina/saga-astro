// src/game/audioManager.js
// Audio manager for The Soulforge Saga

import { gameStateManager } from './stateManager.js';

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.musicTracks = new Map();
    this.masterVolume = 1.0;
    this.musicVolume = 1.0;
    this.sfxVolume = 1.0;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    
    // Audio categories
    this.categories = {
      'ui': { volume: 1.0 },
      'combat': { volume: 1.0 },
      'exploration': { volume: 1.0 },
      'ambient': { volume: 0.7 },
      'music': { volume: 0.8 }
    };
  }

  // Initialize audio manager
  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context on first user interaction
      const resumeContext = () => {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        document.removeEventListener('click', resumeContext);
        document.removeEventListener('touchstart', resumeContext);
        document.removeEventListener('keydown', resumeContext);
      };
      
      document.addEventListener('click', resumeContext);
      document.addEventListener('touchstart', resumeContext);
      document.addEventListener('keydown', resumeContext);
      
      console.log('Audio manager initialized');
      return { success: true, message: 'Audio manager initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize audio manager:', error);
      return { success: false, message: 'Failed to initialize audio manager: ' + error.message };
    }
  }

  // Preload sound effects
  preloadSound(soundId, url) {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        audio.load();
        
        audio.addEventListener('canplaythrough', () => {
          this.sounds.set(soundId, audio);
          console.log(`Sound preloaded: ${soundId}`);
          resolve({ success: true, message: `Sound preloaded: ${soundId}` });
        });
        
        audio.addEventListener('error', (error) => {
          console.error(`Failed to preload sound ${soundId}:`, error);
          reject({ success: false, message: `Failed to preload sound ${soundId}: ${error.message}` });
        });
      } catch (error) {
        console.error(`Failed to preload sound ${soundId}:`, error);
        reject({ success: false, message: `Failed to preload sound ${soundId}: ${error.message}` });
      }
    });
  }

  // Play sound effect
  playSound(soundId, category = 'ui', volume = 1.0) {
    if (!this.sfxEnabled) {
      return { success: false, message: 'Sound effects disabled' };
    }
    
    const sound = this.sounds.get(soundId);
    if (!sound) {
      console.warn(`Sound not found: ${soundId}`);
      return { success: false, message: `Sound not found: ${soundId}` };
    }
    
    try {
      // Clone the audio to allow overlapping playback
      const clone = sound.cloneNode();
      
      // Calculate final volume
      const categoryVolume = this.categories[category]?.volume || 1.0;
      const finalVolume = this.masterVolume * this.sfxVolume * categoryVolume * volume;
      clone.volume = Math.min(1.0, Math.max(0.0, finalVolume));
      
      // Play the sound
      const promise = clone.play();
      
      if (promise !== undefined) {
        promise.catch(error => {
          console.warn(`Failed to play sound ${soundId}:`, error);
        });
      }
      
      return { success: true, message: `Playing sound: ${soundId}` };
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      return { success: false, message: `Failed to play sound ${soundId}: ${error.message}` };
    }
  }

  // Preload music track
  preloadMusic(trackId, url) {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        audio.loop = true; // Music typically loops
        audio.load();
        
        audio.addEventListener('canplaythrough', () => {
          this.musicTracks.set(trackId, audio);
          console.log(`Music track preloaded: ${trackId}`);
          resolve({ success: true, message: `Music track preloaded: ${trackId}` });
        });
        
        audio.addEventListener('error', (error) => {
          console.error(`Failed to preload music ${trackId}:`, error);
          reject({ success: false, message: `Failed to preload music ${trackId}: ${error.message}` });
        });
      } catch (error) {
        console.error(`Failed to preload music ${trackId}:`, error);
        reject({ success: false, message: `Failed to preload music ${trackId}: ${error.message}` });
      }
    });
  }

  // Play music track
  playMusic(trackId, volume = 1.0) {
    if (!this.musicEnabled) {
      return { success: false, message: 'Music disabled' };
    }
    
    const track = this.musicTracks.get(trackId);
    if (!track) {
      console.warn(`Music track not found: ${trackId}`);
      return { success: false, message: `Music track not found: ${trackId}` };
    }
    
    try {
      // Stop any currently playing music
      this.stopMusic();
      
      // Calculate final volume
      const categoryVolume = this.categories['music']?.volume || 1.0;
      const finalVolume = this.masterVolume * this.musicVolume * categoryVolume * volume;
      track.volume = Math.min(1.0, Math.max(0.0, finalVolume));
      
      // Play the music
      const promise = track.play();
      
      if (promise !== undefined) {
        promise.catch(error => {
          console.warn(`Failed to play music ${trackId}:`, error);
        });
      }
      
      console.log(`Playing music: ${trackId}`);
      return { success: true, message: `Playing music: ${trackId}` };
    } catch (error) {
      console.error(`Failed to play music ${trackId}:`, error);
      return { success: false, message: `Failed to play music ${trackId}: ${error.message}` };
    }
  }

  // Stop music
  stopMusic() {
    try {
      for (const [trackId, track] of this.musicTracks) {
        if (!track.paused) {
          track.pause();
          track.currentTime = 0;
        }
      }
      
      console.log('Music stopped');
      return { success: true, message: 'Music stopped' };
    } catch (error) {
      console.error('Failed to stop music:', error);
      return { success: false, message: 'Failed to stop music: ' + error.message };
    }
  }

  // Pause music
  pauseMusic() {
    try {
      for (const [trackId, track] of this.musicTracks) {
        if (!track.paused) {
          track.pause();
        }
      }
      
      console.log('Music paused');
      return { success: true, message: 'Music paused' };
    } catch (error) {
      console.error('Failed to pause music:', error);
      return { success: false, message: 'Failed to pause music: ' + error.message };
    }
  }

  // Resume music
  resumeMusic() {
    try {
      for (const [trackId, track] of this.musicTracks) {
        if (track.paused && track.currentTime > 0) {
          track.play();
        }
      }
      
      console.log('Music resumed');
      return { success: true, message: 'Music resumed' };
    } catch (error) {
      console.error('Failed to resume music:', error);
      return { success: false, message: 'Failed to resume music: ' + error.message };
    }
  }

  // Set master volume
  setMasterVolume(volume) {
    this.masterVolume = Math.min(1.0, Math.max(0.0, volume));
    console.log(`Master volume set to ${this.masterVolume}`);
    return { success: true, message: `Master volume set to ${this.masterVolume}` };
  }

  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = Math.min(1.0, Math.max(0.0, volume));
    console.log(`Music volume set to ${this.musicVolume}`);
    return { success: true, message: `Music volume set to ${this.musicVolume}` };
  }

  // Set SFX volume
  setSFXVolume(volume) {
    this.sfxVolume = Math.min(1.0, Math.max(0.0, volume));
    console.log(`SFX volume set to ${this.sfxVolume}`);
    return { success: true, message: `SFX volume set to ${this.sfxVolume}` };
  }

  // Enable/disable music
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    
    if (!enabled) {
      this.stopMusic();
    }
    
    console.log(`Music ${enabled ? 'enabled' : 'disabled'}`);
    return { success: true, message: `Music ${enabled ? 'enabled' : 'disabled'}` };
  }

  // Enable/disable sound effects
  setSFXEnabled(enabled) {
    this.sfxEnabled = enabled;
    console.log(`Sound effects ${enabled ? 'enabled' : 'disabled'}`);
    return { success: true, message: `Sound effects ${enabled ? 'enabled' : 'disabled'}` };
  }

  // Set category volume
  setCategoryVolume(category, volume) {
    if (this.categories[category]) {
      this.categories[category].volume = Math.min(1.0, Math.max(0.0, volume));
      console.log(`Category ${category} volume set to ${this.categories[category].volume}`);
      return { success: true, message: `Category ${category} volume set to ${this.categories[category].volume}` };
    } else {
      console.warn(`Category not found: ${category}`);
      return { success: false, message: `Category not found: ${category}` };
    }
  }

  // Preload common game sounds
  async preloadCommonSounds() {
    const commonSounds = [
      // UI sounds
      { id: 'ui_click', url: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3' },
      { id: 'ui_hover', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cool-interface-click-tone-2955.mp3' },
      { id: 'ui_error', url: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3' },
      { id: 'ui_success', url: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3' },
      
      // Combat sounds
      { id: 'combat_sword_swing', url: 'https://assets.mixkit.co/sfx/preview/mixkit-fast-sword-slash-2160.mp3' },
      { id: 'combat_sword_hit', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sword-cutting-flesh-2161.mp3' },
      { id: 'combat_magic_cast', url: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-whoosh-618.mp3' },
      { id: 'combat_magic_hit', url: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-hit-2162.mp3' },
      { id: 'combat_shield_block', url: 'https://assets.mixkit.co/sfx/preview/mixkit-metal-armor-collision-2163.mp3' },
      { id: 'combat_death', url: 'https://assets.mixkit.co/sfx/preview/mixkit-game-character-dying-2164.mp3' },
      
      // Exploration sounds
      { id: 'explore_footstep_grass', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-double-step-on-grass-2165.mp3' },
      { id: 'explore_footstep_stone', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-double-step-on-stone-2166.mp3' },
      { id: 'explore_door_open', url: 'https://assets.mixkit.co/sfx/preview/mixkit-door-open-2167.mp3' },
      { id: 'explore_chest_open', url: 'https://assets.mixkit.co/sfx/preview/mixkit-chest-open-2168.mp3' },
      { id: 'explore_pickup_item', url: 'https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-193.mp3' },
      
      // Ambient sounds
      { id: 'ambient_wind', url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-in-the-forest-2169.mp3' },
      { id: 'ambient_fire', url: 'https://assets.mixkit.co/sfx/preview/mixkit-fire-crackling-1330.mp3' },
      { id: 'ambient_water', url: 'https://assets.mixkit.co/sfx/preview/mixkit-water-in-a-stream-1329.mp3' }
    ];
    
    const results = [];
    
    for (const sound of commonSounds) {
      try {
        const result = await this.preloadSound(sound.id, sound.url);
        results.push(result);
      } catch (error) {
        results.push(error);
      }
    }
    
    console.log('Common sounds preloaded');
    return { success: true, message: 'Common sounds preloaded', results: results };
  }

  // Preload common music tracks
  async preloadCommonMusic() {
    const commonMusic = [
      // Background music tracks
      { id: 'bgm_main_theme', url: 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-625.mp3' },
      { id: 'bgm_combat', url: 'https://assets.mixkit.co/music/preview/mixkit-arcade-retro-game-over-213.mp3' },
      { id: 'bgm_exploration', url: 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-625.mp3' },
      { id: 'bgm_town', url: 'https://assets.mixkit.co/music/preview/mixkit-game-show-opening-624.mp3' }
    ];
    
    const results = [];
    
    for (const track of commonMusic) {
      try {
        const result = await this.preloadMusic(track.id, track.url);
        results.push(result);
      } catch (error) {
        results.push(error);
      }
    }
    
    console.log('Common music tracks preloaded');
    return { success: true, message: 'Common music tracks preloaded', results: results };
  }

  // Play contextual ambient sounds based on location
  playContextualAmbient(location) {
    if (!this.sfxEnabled) return;
    
    // Stop any currently playing ambient sounds
    this.stopAmbientSounds();
    
    // Play appropriate ambient sound based on location
    switch (location) {
      case 'TheCentralNexus':
        this.playAmbientSound('ambient_energy');
        break;
      case 'TheWhisperingReaches':
        this.playAmbientSound('ambient_wind');
        break;
      case 'TheLuminousPlains':
        this.playAmbientSound('ambient_birds');
        break;
      case 'TheShatteredPeaks':
        this.playAmbientSound('ambient_wind');
        break;
      case 'TheCrimsonDesert':
        this.playAmbientSound('ambient_wind');
        break;
      default:
        this.playAmbientSound('ambient_generic');
    }
  }

  // Play ambient sound
  playAmbientSound(soundId) {
    return this.playSound(soundId, 'ambient', this.categories['ambient'].volume);
  }

  // Stop ambient sounds
  stopAmbientSounds() {
    // In a real implementation, we would stop specific ambient sounds
    console.log('Stopping ambient sounds');
  }

  // Cleanup resources
  cleanup() {
    try {
      // Stop all audio
      this.stopMusic();
      this.stopAmbientSounds();
      
      // Clear maps
      this.sounds.clear();
      this.musicTracks.clear();
      
      console.log('Audio manager cleaned up');
      return { success: true, message: 'Audio manager cleaned up' };
    } catch (error) {
      console.error('Failed to cleanup audio manager:', error);
      return { success: false, message: 'Failed to cleanup audio manager: ' + error.message };
    }
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();

// Export the class for potential extension
export default AudioManager;