// src/game/visualEffectsManager.js
// Visual effects manager for The Soulforge Saga

import { gameStateManager } from './stateManager.js';

class VisualEffectsManager {
  constructor() {
    this.effectsCanvas = null;
    this.effectsContext = null;
    this.particleSystems = new Map();
    this.animations = new Map();
    this.screenShake = { intensity: 0, duration: 0, startTime: 0 };
    this.colorFilters = new Map();
    this.postProcessingEffects = new Map();
    this.uiAnimations = new Map();
    
    // Effect configurations
    this.effectConfigs = {
      'screen_shake_light': { intensity: 5, duration: 500 },
      'screen_shake_medium': { intensity: 10, duration: 1000 },
      'screen_shake_heavy': { intensity: 20, duration: 1500 },
      'glow_pulse': { color: '#6366F1', intensity: 0.5, duration: 2000, frequency: 1 },
      'magic_sparkle': { particleCount: 50, color: '#A78BFA', size: 3, duration: 3000 },
      'fire_explosion': { particleCount: 100, color: '#F87171', size: 5, duration: 2000 },
      'ice_crystal': { particleCount: 30, color: '#93C5FD', size: 4, duration: 2500 },
      'healing_aura': { color: '#34D399', intensity: 0.3, duration: 3000, pulse: true },
      'corruption_effect': { color: '#F87171', intensity: 0.4, duration: 5000, pulse: true },
      'nexus_stable': { color: '#34D399', intensity: 0.2, duration: 10000, pulse: true }
    };
  }

  // Initialize visual effects manager
  initialize() {
    try {
      // Create canvas for effects
      this.effectsCanvas = document.createElement('canvas');
      this.effectsCanvas.id = 'visual-effects-canvas';
      this.effectsCanvas.style.position = 'fixed';
      this.effectsCanvas.style.top = '0';
      this.effectsCanvas.style.left = '0';
      this.effectsCanvas.style.width = '100%';
      this.effectsCanvas.style.height = '100%';
      this.effectsCanvas.style.pointerEvents = 'none';
      this.effectsCanvas.style.zIndex = '9999';
      this.effectsCanvas.style.display = 'none'; // Hidden by default
      
      // Append to body
      document.body.appendChild(this.effectsCanvas);
      
      // Get 2D context
      this.effectsContext = this.effectsCanvas.getContext('2d');
      
      // Set canvas size
      this.resizeCanvas();
      
      // Add resize listener
      window.addEventListener('resize', () => this.resizeCanvas());
      
      console.log('Visual effects manager initialized');
      return { success: true, message: 'Visual effects manager initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize visual effects manager:', error);
      return { success: false, message: 'Failed to initialize visual effects manager: ' + error.message };
    }
  }

  // Resize canvas to match window
  resizeCanvas() {
    if (this.effectsCanvas) {
      this.effectsCanvas.width = window.innerWidth;
      this.effectsCanvas.height = window.innerHeight;
    }
  }

  // Show effects canvas
  showEffectsCanvas() {
    if (this.effectsCanvas) {
      this.effectsCanvas.style.display = 'block';
    }
  }

  // Hide effects canvas
  hideEffectsCanvas() {
    if (this.effectsCanvas) {
      this.effectsCanvas.style.display = 'none';
    }
  }

  // Apply screen shake effect
  applyScreenShake(intensity = 10, duration = 1000) {
    // Store screen shake parameters
    this.screenShake = {
      intensity: intensity,
      duration: duration,
      startTime: Date.now()
    };
    
    // Show effects canvas
    this.showEffectsCanvas();
    
    // Start screen shake animation
    this.animateScreenShake();
    
    console.log(`Screen shake applied: ${intensity} intensity for ${duration}ms`);
    return { success: true, message: `Screen shake applied: ${intensity} intensity for ${duration}ms` };
  }

  // Animate screen shake
  animateScreenShake() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.screenShake.startTime;
    
    // Check if shake is still active
    if (elapsed < this.screenShake.duration) {
      // Calculate shake offset
      const progress = elapsed / this.screenShake.duration;
      const decay = 1 - progress; // Decay over time
      const offsetX = (Math.random() - 0.5) * this.screenShake.intensity * decay * 2;
      const offsetY = (Math.random() - 0.5) * this.screenShake.intensity * decay * 2;
      
      // Apply transform to body
      document.body.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      
      // Continue animation
      requestAnimationFrame(() => this.animateScreenShake());
    } else {
      // Reset transform
      document.body.style.transform = 'translate(0px, 0px)';
      
      // Hide effects canvas if no other effects are active
      if (this.particleSystems.size === 0 && this.animations.size === 0) {
        this.hideEffectsCanvas();
      }
      
      // Reset screen shake
      this.screenShake = { intensity: 0, duration: 0, startTime: 0 };
      
      console.log('Screen shake ended');
    }
  }

  // Create particle system
  createParticleSystem(effectId, x, y, config = {}) {
    const particleSystemId = `particle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get effect config or use defaults
    const effectConfig = this.effectConfigs[effectId] || {
      particleCount: 30,
      color: '#FFFFFF',
      size: 3,
      duration: 2000
    };
    
    // Merge with custom config
    const finalConfig = { ...effectConfig, ...config };
    
    // Create particle system
    const particleSystem = {
      id: particleSystemId,
      x: x,
      y: y,
      config: finalConfig,
      particles: [],
      startTime: Date.now(),
      active: true
    };
    
    // Initialize particles
    for (let i = 0; i < finalConfig.particleCount; i++) {
      const particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 100, // Random velocity
        vy: (Math.random() - 0.5) * 100,
        size: Math.random() * finalConfig.size + 1,
        color: finalConfig.color,
        alpha: 1.0,
        life: Math.random() * finalConfig.duration + 500 // Random life between 500ms and duration+500ms
      };
      particleSystem.particles.push(particle);
    }
    
    // Store particle system
    this.particleSystems.set(particleSystemId, particleSystem);
    
    // Show effects canvas
    this.showEffectsCanvas();
    
    // Start animation
    this.animateParticleSystem(particleSystemId);
    
    console.log(`Particle system created: ${particleSystemId}`);
    return { success: true, message: `Particle system created: ${particleSystemId}`, id: particleSystemId };
  }

  // Animate particle system
  animateParticleSystem(systemId) {
    const particleSystem = this.particleSystems.get(systemId);
    if (!particleSystem || !particleSystem.active) {
      return;
    }
    
    const currentTime = Date.now();
    const elapsed = currentTime - particleSystem.startTime;
    
    // Check if system is still active
    if (elapsed < particleSystem.config.duration) {
      // Update particles
      for (let i = particleSystem.particles.length - 1; i >= 0; i--) {
        const particle = particleSystem.particles[i];
        
        // Update position
        particle.x += particle.vx * 0.016; // Assuming 60fps
        particle.y += particle.vy * 0.016;
        
        // Apply gravity
        particle.vy += 50 * 0.016;
        
        // Apply drag
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Update alpha based on life
        const particleElapsed = currentTime - (particleSystem.startTime + (particleSystem.config.duration - particle.life));
        particle.alpha = 1.0 - (particleElapsed / particle.life);
        
        // Remove dead particles
        if (particle.alpha <= 0) {
          particleSystem.particles.splice(i, 1);
        }
      }
      
      // Render particles
      this.renderParticles(particleSystem);
      
      // Continue animation
      requestAnimationFrame(() => this.animateParticleSystem(systemId));
    } else {
      // Remove particle system
      this.particleSystems.delete(systemId);
      
      // Hide effects canvas if no other effects are active
      if (this.screenShake.intensity === 0 && this.animations.size === 0) {
        this.hideEffectsCanvas();
      }
      
      console.log(`Particle system ended: ${systemId}`);
    }
  }

  // Render particles
  renderParticles(particleSystem) {
    if (!this.effectsContext) return;
    
    // Clear canvas
    this.effectsContext.clearRect(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);
    
    // Render each particle
    particleSystem.particles.forEach(particle => {
      this.effectsContext.globalAlpha = particle.alpha;
      this.effectsContext.fillStyle = particle.color;
      this.effectsContext.beginPath();
      this.effectsContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.effectsContext.fill();
    });
    
    // Reset global alpha
    this.effectsContext.globalAlpha = 1.0;
  }

  // Apply color filter effect
  applyColorFilter(filterId, color, intensity = 0.5, duration = 3000) {
    // Store color filter
    this.colorFilters.set(filterId, {
      color: color,
      intensity: intensity,
      duration: duration,
      startTime: Date.now()
    });
    
    // Apply CSS filter to body
    document.body.style.filter = `hue-rotate(${intensity * 360}deg) saturate(${1 + intensity})`;
    
    // Show effects canvas
    this.showEffectsCanvas();
    
    // Set timeout to remove filter
    setTimeout(() => {
      this.removeColorFilter(filterId);
    }, duration);
    
    console.log(`Color filter applied: ${filterId}`);
    return { success: true, message: `Color filter applied: ${filterId}` };
  }

  // Remove color filter
  removeColorFilter(filterId) {
    // Remove filter
    this.colorFilters.delete(filterId);
    
    // Reset CSS filter if no filters remain
    if (this.colorFilters.size === 0) {
      document.body.style.filter = 'none';
    }
    
    // Hide effects canvas if no other effects are active
    if (this.screenShake.intensity === 0 && this.particleSystems.size === 0 && this.animations.size === 0) {
      this.hideEffectsCanvas();
    }
    
    console.log(`Color filter removed: ${filterId}`);
    return { success: true, message: `Color filter removed: ${filterId}` };
  }

  // Apply glow pulse effect
  applyGlowPulse(elementId, color = '#6366F1', intensity = 0.5, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element not found: ${elementId}`);
      return { success: false, message: `Element not found: ${elementId}` };
    }
    
    // Store animation
    const animationId = `glow_${elementId}_${Date.now()}`;
    this.animations.set(animationId, {
      elementId: elementId,
      type: 'glow',
      color: color,
      intensity: intensity,
      duration: duration,
      startTime: Date.now()
    });
    
    // Apply glow effect
    element.style.boxShadow = `0 0 ${20 * intensity}px ${color}`;
    element.style.transition = 'box-shadow 0.3s ease';
    
    // Set timeout to remove glow
    setTimeout(() => {
      this.removeGlowPulse(animationId);
    }, duration);
    
    console.log(`Glow pulse applied to ${elementId}`);
    return { success: true, message: `Glow pulse applied to ${elementId}`, id: animationId };
  }

  // Remove glow pulse
  removeGlowPulse(animationId) {
    const animation = this.animations.get(animationId);
    if (!animation) {
      return { success: false, message: `Animation not found: ${animationId}` };
    }
    
    const element = document.getElementById(animation.elementId);
    if (element) {
      element.style.boxShadow = 'none';
    }
    
    // Remove animation
    this.animations.delete(animationId);
    
    // Hide effects canvas if no other effects are active
    if (this.screenShake.intensity === 0 && this.particleSystems.size === 0 && this.colorFilters.size === 0) {
      this.hideEffectsCanvas();
    }
    
    console.log(`Glow pulse removed from ${animation.elementId}`);
    return { success: true, message: `Glow pulse removed from ${animation.elementId}` };
  }

  // Apply UI animation
  applyUIAnimation(elementId, animationType, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element not found: ${elementId}`);
      return { success: false, message: `Element not found: ${elementId}` };
    }
    
    // Store UI animation
    const animationId = `ui_${elementId}_${Date.now()}`;
    this.uiAnimations.set(animationId, {
      elementId: elementId,
      type: animationType,
      duration: duration,
      startTime: Date.now()
    });
    
    // Apply animation based on type
    switch (animationType) {
      case 'bounce':
        element.style.animation = `bounce ${duration}ms ease`;
        break;
      case 'pulse':
        element.style.animation = `pulse ${duration}ms ease infinite`;
        break;
      case 'shake':
        element.style.animation = `shake ${duration}ms ease`;
        break;
      case 'fade_in':
        element.style.animation = `fadeIn ${duration}ms ease`;
        break;
      case 'fade_out':
        element.style.animation = `fadeOut ${duration}ms ease`;
        break;
      default:
        console.warn(`Unknown animation type: ${animationType}`);
        return { success: false, message: `Unknown animation type: ${animationType}` };
    }
    
    // Set timeout to clean up animation
    setTimeout(() => {
      this.removeUIAnimation(animationId);
    }, duration);
    
    console.log(`UI animation applied to ${elementId}: ${animationType}`);
    return { success: true, message: `UI animation applied to ${elementId}: ${animationType}`, id: animationId };
  }

  // Remove UI animation
  removeUIAnimation(animationId) {
    const animation = this.uiAnimations.get(animationId);
    if (!animation) {
      return { success: false, message: `Animation not found: ${animationId}` };
    }
    
    const element = document.getElementById(animation.elementId);
    if (element) {
      element.style.animation = 'none';
    }
    
    // Remove animation
    this.uiAnimations.delete(animationId);
    
    console.log(`UI animation removed from ${animation.elementId}`);
    return { success: true, message: `UI animation removed from ${animation.elementId}` };
  }

  // Predefined animations (would be defined in CSS)
  // These would typically be defined in a separate CSS file
  getPredefinedAnimations() {
    return `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-30px);}
        60% {transform: translateY(-15px);}
      }
      
      @keyframes pulse {
        0% {transform: scale(1);}
        50% {transform: scale(1.05);}
        100% {transform: scale(1);}
      }
      
      @keyframes shake {
        0%, 100% {transform: translateX(0);}
        10%, 30%, 50%, 70%, 90% {transform: translateX(-10px);}
        20%, 40%, 60%, 80% {transform: translateX(10px);}
      }
      
      @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
      }
      
      @keyframes fadeOut {
        from {opacity: 1;}
        to {opacity: 0;}
      }
    `;
  }

  // Apply post-processing effect
  applyPostProcessingEffect(effectId, intensity = 1.0, duration = 5000) {
    // Store post-processing effect
    this.postProcessingEffects.set(effectId, {
      intensity: intensity,
      duration: duration,
      startTime: Date.now()
    });
    
    // Apply effect (simplified)
    switch (effectId) {
      case 'blur':
        document.body.style.filter = `blur(${intensity * 5}px)`;
        break;
      case 'brightness':
        document.body.style.filter = `brightness(${1 + intensity})`;
        break;
      case 'contrast':
        document.body.style.filter = `contrast(${1 + intensity})`;
        break;
      case 'saturation':
        document.body.style.filter = `saturate(${1 + intensity})`;
        break;
      default:
        console.warn(`Unknown post-processing effect: ${effectId}`);
        return { success: false, message: `Unknown post-processing effect: ${effectId}` };
    }
    
    // Show effects canvas
    this.showEffectsCanvas();
    
    // Set timeout to remove effect
    setTimeout(() => {
      this.removePostProcessingEffect(effectId);
    }, duration);
    
    console.log(`Post-processing effect applied: ${effectId}`);
    return { success: true, message: `Post-processing effect applied: ${effectId}` };
  }

  // Remove post-processing effect
  removePostProcessingEffect(effectId) {
    // Remove effect
    this.postProcessingEffects.delete(effectId);
    
    // Reset filter if no effects remain
    if (this.postProcessingEffects.size === 0 && this.colorFilters.size === 0) {
      document.body.style.filter = 'none';
    }
    
    // Hide effects canvas if no other effects are active
    if (this.screenShake.intensity === 0 && this.particleSystems.size === 0 && this.animations.size === 0) {
      this.hideEffectsCanvas();
    }
    
    console.log(`Post-processing effect removed: ${effectId}`);
    return { success: true, message: `Post-processing effect removed: ${effectId}` };
  }

  // Cleanup all effects
  cleanup() {
    try {
      // Stop all animations
      this.screenShake = { intensity: 0, duration: 0, startTime: 0 };
      this.particleSystems.clear();
      this.animations.clear();
      this.colorFilters.clear();
      this.postProcessingEffects.clear();
      this.uiAnimations.clear();
      
      // Reset body styles
      document.body.style.transform = 'translate(0px, 0px)';
      document.body.style.filter = 'none';
      
      // Hide effects canvas
      this.hideEffectsCanvas();
      
      console.log('Visual effects manager cleaned up');
      return { success: true, message: 'Visual effects manager cleaned up' };
    } catch (error) {
      console.error('Failed to cleanup visual effects manager:', error);
      return { success: false, message: 'Failed to cleanup visual effects manager: ' + error.message };
    }
  }
}

// Export a singleton instance
export const visualEffectsManager = new VisualEffectsManager();

// Export the class for potential extension
export default VisualEffectsManager;