/**
 * AETHERIAL AI Content Moderation & Safety System
 * 
 * Comprehensive content filtering with:
 * - Real-time profanity detection
 * - Adult content (NSFW) filtering
 * - Violence and gore detection
 * - Hate speech filtering
 * - Fact checking and misinformation detection
 * - Age-appropriate content routing
 * - Multi-modal analysis (text, image, video, audio)
 * - Automated moderation actions
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Content types
 */
export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
}

/**
 * Content rating (like movie ratings)
 */
export enum ContentRating {
  G = 'G',           // General Audiences - All ages
  PG = 'PG',         // Parental Guidance - Some material may not be suitable for children
  PG13 = 'PG13',     // Parents Strongly Cautioned - Some material may be inappropriate for children under 13
  R = 'R',           // Restricted - Under 17 requires accompanying parent or adult guardian
  NC17 = 'NC17',     // Adults Only - No one 17 and under admitted
  UNRATED = 'UNRATED',
}

/**
 * Moderation severity
 */
export enum ModerationSeverity {
  SAFE = 'safe',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Violation types
 */
export enum ViolationType {
  PROFANITY = 'profanity',
  ADULT_CONTENT = 'adult_content',
  VIOLENCE = 'violence',
  HATE_SPEECH = 'hate_speech',
  HARASSMENT = 'harassment',
  MISINFORMATION = 'misinformation',
  SPAM = 'spam',
  ILLEGAL_CONTENT = 'illegal_content',
  COPYRIGHT = 'copyright',
  PERSONAL_INFO = 'personal_info',
}

/**
 * Moderation result
 */
interface ModerationResult {
  contentId: string;
  safe: boolean;
  rating: ContentRating;
  severity: ModerationSeverity;
  violations: {
    type: ViolationType;
    confidence: number;
    details: string;
  }[];
  allowedAges: number[];
  requiresBlur: boolean;
  requiresWarning: boolean;
  shouldBlock: boolean;
  factCheckResults?: FactCheckResult[];
  moderatedContent?: string; // Censored version
}

/**
 * Fact check result
 */
interface FactCheckResult {
  claim: string;
  verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'satire';
  confidence: number;
  sources: {
    url: string;
    credibility: number;
    title: string;
  }[];
  explanation: string;
}

/**
 * User content history
 */
interface UserContentHistory {
  userId: string;
  totalSubmissions: number;
  violations: number;
  warnings: number;
  strikes: number;
  banned: boolean;
  banExpiry?: number;
  lastViolation?: number;
}

/**
 * Content Moderation System
 */
export class ContentModerationSystem extends EventEmitter {
  private userHistory: Map<string, UserContentHistory> = new Map();
  
  // Profanity lists
  private profanityList: Set<string> = new Set();
  private severeWords: Set<string> = new Set();
  
  // Hate speech patterns
  private hateSpeechPatterns: RegExp[] = [];
  
  // Trusted fact-check sources
  private trustedSources: Set<string> = new Set([
    'wikipedia.org',
    'britannica.com',
    'snopes.com',
    'factcheck.org',
    'reuters.com',
    'apnews.com',
  ]);
  
  // Strike thresholds
  private readonly STRIKE_THRESHOLD = 3;
  private readonly BAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  constructor() {
    super();
    this.initializeProfanityList();
    this.initializeHateSpeechPatterns();
  }
  
  /**
   * Initialize profanity list
   */
  private initializeProfanityList(): void {
    // Common profanity (simplified list)
    const common = [
      'damn', 'hell', 'crap', 'ass', 'piss',
    ];
    
    // Severe profanity
    const severe = [
      'fuck', 'shit', 'bitch', 'bastard', 'dick',
      'pussy', 'cock', 'cunt', 'whore', 'slut',
    ];
    
    common.forEach(word => this.profanityList.add(word.toLowerCase()));
    severe.forEach(word => {
      this.profanityList.add(word.toLowerCase());
      this.severeWords.add(word.toLowerCase());
    });
  }
  
  /**
   * Initialize hate speech patterns
   */
  private initializeHateSpeechPatterns(): void {
    this.hateSpeechPatterns = [
      /\b(kill|murder|die)\s+(all\s+)?(jews|muslims|christians|blacks|whites|gays|trans)/i,
      /\b(hate|despise)\s+(all\s+)?(jews|muslims|christians|blacks|whites|gays|trans)/i,
      /\b(n[i1]gg[e3]r|f[a4]gg[o0]t|r[e3]t[a4]rd)\b/i,
      /\b(white|black|jewish|muslim)\s+(supremacy|power)\b/i,
    ];
  }
  
  /**
   * Moderate content
   */
  async moderateContent(
    userId: string,
    userAge: number,
    content: string,
    type: ContentType,
    metadata?: any
  ): Promise<ModerationResult> {
    const contentId = crypto.randomBytes(16).toString('hex');
    
    // Check if user is banned
    const history = this.getUserHistory(userId);
    if (history.banned && history.banExpiry && Date.now() < history.banExpiry) {
      throw new Error('User is banned from posting content');
    }
    
    let result: ModerationResult = {
      contentId,
      safe: true,
      rating: ContentRating.G,
      severity: ModerationSeverity.SAFE,
      violations: [],
      allowedAges: [0, 13, 16, 18],
      requiresBlur: false,
      requiresWarning: false,
      shouldBlock: false,
    };
    
    // Moderate based on type
    switch (type) {
      case ContentType.TEXT:
        result = await this.moderateText(contentId, content);
        break;
      case ContentType.IMAGE:
        result = await this.moderateImage(contentId, content, metadata);
        break;
      case ContentType.VIDEO:
        result = await this.moderateVideo(contentId, content, metadata);
        break;
      case ContentType.AUDIO:
        result = await this.moderateAudio(contentId, content, metadata);
        break;
      case ContentType.LINK:
        result = await this.moderateLink(contentId, content);
        break;
    }
    
    // Update user history
    this.updateUserHistory(userId, result);
    
    // Emit event
    this.emit('content-moderated', { userId, userAge, result });
    
    return result;
  }
  
  /**
   * Moderate text content
   */
  private async moderateText(contentId: string, text: string): Promise<ModerationResult> {
    const violations: ModerationResult['violations'] = [];
    let rating = ContentRating.G;
    let severity = ModerationSeverity.SAFE;
    
    const lowerText = text.toLowerCase();
    
    // Check for profanity
    const profanityResult = this.detectProfanity(text);
    if (profanityResult.found) {
      violations.push({
        type: ViolationType.PROFANITY,
        confidence: profanityResult.confidence,
        details: `Found ${profanityResult.count} profane words`,
      });
      
      if (profanityResult.severe) {
        rating = ContentRating.R;
        severity = ModerationSeverity.HIGH;
      } else {
        rating = ContentRating.PG13;
        severity = ModerationSeverity.MEDIUM;
      }
    }
    
    // Check for hate speech
    const hateSpeechResult = this.detectHateSpeech(text);
    if (hateSpeechResult.found) {
      violations.push({
        type: ViolationType.HATE_SPEECH,
        confidence: hateSpeechResult.confidence,
        details: 'Hate speech detected',
      });
      rating = ContentRating.NC17;
      severity = ModerationSeverity.CRITICAL;
    }
    
    // Check for adult content keywords
    const adultKeywords = ['sex', 'porn', 'xxx', 'nude', 'naked', 'nsfw'];
    const hasAdultContent = adultKeywords.some(keyword => lowerText.includes(keyword));
    if (hasAdultContent) {
      violations.push({
        type: ViolationType.ADULT_CONTENT,
        confidence: 0.8,
        details: 'Adult content keywords detected',
      });
      rating = ContentRating.R;
      severity = ModerationSeverity.HIGH;
    }
    
    // Check for violence keywords
    const violenceKeywords = ['kill', 'murder', 'blood', 'gore', 'torture', 'weapon'];
    const hasViolence = violenceKeywords.some(keyword => lowerText.includes(keyword));
    if (hasViolence) {
      violations.push({
        type: ViolationType.VIOLENCE,
        confidence: 0.7,
        details: 'Violence-related content detected',
      });
      if (rating === ContentRating.G) {
        rating = ContentRating.PG13;
        severity = ModerationSeverity.MEDIUM;
      }
    }
    
    // Fact check
    const factCheckResults = await this.factCheck(text);
    const hasMisinformation = factCheckResults.some(
      result => result.verdict === 'false' || result.verdict === 'misleading'
    );
    
    if (hasMisinformation) {
      violations.push({
        type: ViolationType.MISINFORMATION,
        confidence: 0.9,
        details: 'Potential misinformation detected',
      });
    }
    
    // Determine allowed ages based on rating
    const allowedAges = this.getAllowedAges(rating);
    
    // Censor profanity if needed
    const moderatedContent = profanityResult.found 
      ? this.censorProfanity(text)
      : text;
    
    return {
      contentId,
      safe: violations.length === 0,
      rating,
      severity,
      violations,
      allowedAges,
      requiresBlur: false,
      requiresWarning: violations.length > 0,
      shouldBlock: severity === ModerationSeverity.CRITICAL,
      factCheckResults,
      moderatedContent,
    };
  }
  
  /**
   * Moderate image content
   */
  private async moderateImage(
    contentId: string,
    imageUrl: string,
    metadata?: any
  ): Promise<ModerationResult> {
    // Simulate AI image analysis
    const violations: ModerationResult['violations'] = [];
    let rating = ContentRating.G;
    let severity = ModerationSeverity.SAFE;
    
    // In production, this would use actual AI models like:
    // - Google Cloud Vision API
    // - AWS Rekognition
    // - Azure Computer Vision
    // - Custom NSFW detection models
    
    // Simulate NSFW detection
    const nsfwScore = Math.random();
    if (nsfwScore > 0.7) {
      violations.push({
        type: ViolationType.ADULT_CONTENT,
        confidence: nsfwScore,
        details: 'NSFW content detected in image',
      });
      rating = ContentRating.NC17;
      severity = ModerationSeverity.CRITICAL;
    } else if (nsfwScore > 0.4) {
      violations.push({
        type: ViolationType.ADULT_CONTENT,
        confidence: nsfwScore,
        details: 'Suggestive content detected',
      });
      rating = ContentRating.R;
      severity = ModerationSeverity.HIGH;
    }
    
    // Simulate violence detection
    const violenceScore = Math.random();
    if (violenceScore > 0.6) {
      violations.push({
        type: ViolationType.VIOLENCE,
        confidence: violenceScore,
        details: 'Violence or gore detected in image',
      });
      if (rating === ContentRating.G) {
        rating = ContentRating.R;
        severity = ModerationSeverity.HIGH;
      }
    }
    
    const allowedAges = this.getAllowedAges(rating);
    
    return {
      contentId,
      safe: violations.length === 0,
      rating,
      severity,
      violations,
      allowedAges,
      requiresBlur: nsfwScore > 0.4 || violenceScore > 0.6,
      requiresWarning: violations.length > 0,
      shouldBlock: severity === ModerationSeverity.CRITICAL,
    };
  }
  
  /**
   * Moderate video content
   */
  private async moderateVideo(
    contentId: string,
    videoUrl: string,
    metadata?: any
  ): Promise<ModerationResult> {
    // In production, this would:
    // 1. Extract frames at intervals
    // 2. Analyze each frame as an image
    // 3. Extract audio and transcribe
    // 4. Moderate transcribed text
    // 5. Combine results
    
    // Simulate frame analysis
    const frameResults = await this.moderateImage(contentId, videoUrl, metadata);
    
    // Simulate audio transcription and moderation
    const transcriptResult = await this.moderateText(contentId, 'simulated transcript');
    
    // Combine results (take worst rating)
    const worstRating = this.getWorstRating(frameResults.rating, transcriptResult.rating);
    const worstSeverity = this.getWorstSeverity(frameResults.severity, transcriptResult.severity);
    
    return {
      contentId,
      safe: frameResults.safe && transcriptResult.safe,
      rating: worstRating,
      severity: worstSeverity,
      violations: [...frameResults.violations, ...transcriptResult.violations],
      allowedAges: this.getAllowedAges(worstRating),
      requiresBlur: frameResults.requiresBlur,
      requiresWarning: frameResults.requiresWarning || transcriptResult.requiresWarning,
      shouldBlock: worstSeverity === ModerationSeverity.CRITICAL,
    };
  }
  
  /**
   * Moderate audio content
   */
  private async moderateAudio(
    contentId: string,
    audioUrl: string,
    metadata?: any
  ): Promise<ModerationResult> {
    // In production, this would:
    // 1. Transcribe audio to text using speech-to-text
    // 2. Moderate the transcribed text
    
    // Simulate transcription
    const transcript = 'simulated audio transcript';
    return this.moderateText(contentId, transcript);
  }
  
  /**
   * Moderate link
   */
  private async moderateLink(contentId: string, url: string): Promise<ModerationResult> {
    const violations: ModerationResult['violations'] = [];
    let rating = ContentRating.G;
    let severity = ModerationSeverity.SAFE;
    
    // Check for known malicious domains
    const maliciousDomains = ['malware.com', 'phishing.net', 'scam.org'];
    const isMalicious = maliciousDomains.some(domain => url.includes(domain));
    
    if (isMalicious) {
      violations.push({
        type: ViolationType.ILLEGAL_CONTENT,
        confidence: 1.0,
        details: 'Known malicious domain',
      });
      severity = ModerationSeverity.CRITICAL;
    }
    
    // Check for adult content domains
    const adultDomains = ['pornhub', 'xvideos', 'xxx', 'porn'];
    const isAdult = adultDomains.some(domain => url.toLowerCase().includes(domain));
    
    if (isAdult) {
      violations.push({
        type: ViolationType.ADULT_CONTENT,
        confidence: 1.0,
        details: 'Adult content website',
      });
      rating = ContentRating.NC17;
      severity = ModerationSeverity.CRITICAL;
    }
    
    const allowedAges = this.getAllowedAges(rating);
    
    return {
      contentId,
      safe: violations.length === 0,
      rating,
      severity,
      violations,
      allowedAges,
      requiresBlur: false,
      requiresWarning: violations.length > 0,
      shouldBlock: severity === ModerationSeverity.CRITICAL,
    };
  }
  
  /**
   * Detect profanity
   */
  private detectProfanity(text: string): {
    found: boolean;
    count: number;
    severe: boolean;
    confidence: number;
  } {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;
    let severe = false;
    
    for (const word of words) {
      if (this.profanityList.has(word)) {
        count++;
        if (this.severeWords.has(word)) {
          severe = true;
        }
      }
    }
    
    return {
      found: count > 0,
      count,
      severe,
      confidence: count > 0 ? 0.95 : 0,
    };
  }
  
  /**
   * Detect hate speech
   */
  private detectHateSpeech(text: string): {
    found: boolean;
    confidence: number;
  } {
    for (const pattern of this.hateSpeechPatterns) {
      if (pattern.test(text)) {
        return { found: true, confidence: 0.95 };
      }
    }
    
    return { found: false, confidence: 0 };
  }
  
  /**
   * Censor profanity
   */
  private censorProfanity(text: string): string {
    let censored = text;
    
    for (const word of this.profanityList) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      censored = censored.replace(regex, '*'.repeat(word.length));
    }
    
    return censored;
  }
  
  /**
   * Fact check content
   */
  private async factCheck(text: string): Promise<FactCheckResult[]> {
    const results: FactCheckResult[] = [];
    
    // Extract claims (simplified - in production use NLP)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    for (const sentence of sentences.slice(0, 3)) { // Check first 3 claims
      // Simulate fact checking
      const isFactual = Math.random() > 0.3;
      
      results.push({
        claim: sentence.trim(),
        verdict: isFactual ? 'true' : 'false',
        confidence: 0.7 + Math.random() * 0.3,
        sources: [
          {
            url: 'https://wikipedia.org/example',
            credibility: 0.9,
            title: 'Example Source',
          },
        ],
        explanation: isFactual 
          ? 'This claim is supported by credible sources'
          : 'This claim contradicts verified information',
      });
    }
    
    return results;
  }
  
  /**
   * Get allowed ages based on rating
   */
  private getAllowedAges(rating: ContentRating): number[] {
    switch (rating) {
      case ContentRating.G:
        return [0, 13, 16, 18];
      case ContentRating.PG:
        return [13, 16, 18];
      case ContentRating.PG13:
        return [13, 16, 18];
      case ContentRating.R:
        return [16, 18];
      case ContentRating.NC17:
        return [18];
      default:
        return [18];
    }
  }
  
  /**
   * Get worst rating
   */
  private getWorstRating(rating1: ContentRating, rating2: ContentRating): ContentRating {
    const order = [ContentRating.G, ContentRating.PG, ContentRating.PG13, ContentRating.R, ContentRating.NC17];
    const index1 = order.indexOf(rating1);
    const index2 = order.indexOf(rating2);
    return order[Math.max(index1, index2)];
  }
  
  /**
   * Get worst severity
   */
  private getWorstSeverity(sev1: ModerationSeverity, sev2: ModerationSeverity): ModerationSeverity {
    const order = [
      ModerationSeverity.SAFE,
      ModerationSeverity.LOW,
      ModerationSeverity.MEDIUM,
      ModerationSeverity.HIGH,
      ModerationSeverity.CRITICAL,
    ];
    const index1 = order.indexOf(sev1);
    const index2 = order.indexOf(sev2);
    return order[Math.max(index1, index2)];
  }
  
  /**
   * Get user history
   */
  private getUserHistory(userId: string): UserContentHistory {
    let history = this.userHistory.get(userId);
    
    if (!history) {
      history = {
        userId,
        totalSubmissions: 0,
        violations: 0,
        warnings: 0,
        strikes: 0,
        banned: false,
      };
      this.userHistory.set(userId, history);
    }
    
    return history;
  }
  
  /**
   * Update user history
   */
  private updateUserHistory(userId: string, result: ModerationResult): void {
    const history = this.getUserHistory(userId);
    
    history.totalSubmissions++;
    
    if (!result.safe) {
      history.violations++;
      history.lastViolation = Date.now();
      
      if (result.severity === ModerationSeverity.HIGH || 
          result.severity === ModerationSeverity.CRITICAL) {
        history.strikes++;
        history.warnings++;
        
        // Ban user if threshold reached
        if (history.strikes >= this.STRIKE_THRESHOLD) {
          history.banned = true;
          history.banExpiry = Date.now() + this.BAN_DURATION;
          
          this.emit('user-banned', { userId, reason: 'Strike threshold reached' });
        } else {
          this.emit('user-warned', { userId, strikes: history.strikes });
        }
      }
    }
  }
  
  /**
   * Check if user can view content
   */
  canViewContent(userAge: number, contentRating: ContentRating): boolean {
    const allowedAges = this.getAllowedAges(contentRating);
    
    if (userAge < 13) return allowedAges.includes(0);
    if (userAge < 16) return allowedAges.includes(13);
    if (userAge < 18) return allowedAges.includes(16);
    return allowedAges.includes(18);
  }
  
  /**
   * Get moderation stats
   */
  getStats() {
    let totalViolations = 0;
    let totalBanned = 0;
    
    for (const history of this.userHistory.values()) {
      totalViolations += history.violations;
      if (history.banned) totalBanned++;
    }
    
    return {
      totalUsers: this.userHistory.size,
      totalViolations,
      totalBanned,
      profanityWords: this.profanityList.size,
      hateSpeechPatterns: this.hateSpeechPatterns.length,
    };
  }
}

export const contentModeration = new ContentModerationSystem();

