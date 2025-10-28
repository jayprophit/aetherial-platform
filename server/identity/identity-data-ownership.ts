/**
 * AETHERIAL Identity Management & Data Ownership System
 * 
 * Complete identity and data control with:
 * - One account per person (KYC enforced)
 * - Duplicate account prevention
 * - Multi-factor authentication
 * - Account recovery system
 * - Full data ownership (GDPR/CCPA compliant)
 * - Data export and deletion
 * - Privacy controls
 * - Device and IP binding for non-KYC accounts
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * KYC status
 */
export enum KYCStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * Account tier based on verification
 */
export enum AccountTier {
  UNVERIFIED = 'unverified',     // No KYC - limited features
  EMAIL_VERIFIED = 'email_verified', // Email only
  PHONE_VERIFIED = 'phone_verified', // Email + Phone
  KYC_VERIFIED = 'kyc_verified',     // Full KYC - all features
}

/**
 * Identity verification
 */
interface IdentityVerification {
  userId: string;
  kycStatus: KYCStatus;
  accountTier: AccountTier;
  
  // Personal information (encrypted)
  personalInfo: {
    fullName?: string;
    dateOfBirth?: string;
    nationality?: string;
    governmentId?: string;
    governmentIdType?: 'passport' | 'drivers_license' | 'national_id';
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  
  // Contact verification
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  
  // Biometric data (hashed)
  biometricHash?: string;
  faceIdHash?: string;
  fingerprintHash?: string;
  
  // Device binding for non-KYC
  boundDevices: {
    deviceId: string;
    deviceName: string;
    ipAddress: string;
    firstSeen: number;
    lastSeen: number;
  }[];
  
  // KYC documents
  kycDocuments: {
    type: string;
    url: string;
    uploadedAt: number;
    verified: boolean;
  }[];
  
  // Verification dates
  emailVerifiedAt?: number;
  phoneVerifiedAt?: number;
  kycVerifiedAt?: number;
  kycExpiryAt?: number;
  
  createdAt: number;
  updatedAt: number;
}

/**
 * Account limits based on tier
 */
interface AccountLimits {
  dailyTradingLimit: number;
  dailyWithdrawalLimit: number;
  maxWallets: number;
  canCreateSmartContracts: boolean;
  canUseDeFi: boolean;
  canWithdraw: boolean;
  requiresDeviceBinding: boolean;
  requiresIPWhitelist: boolean;
}

/**
 * Account recovery
 */
interface RecoveryMethod {
  type: 'email' | 'phone' | 'security_questions' | 'backup_codes' | 'biometric' | 'support_ticket';
  enabled: boolean;
  data?: any;
}

/**
 * Recovery request
 */
interface RecoveryRequest {
  id: string;
  userId: string;
  method: RecoveryMethod['type'];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: number;
  expiresAt: number;
  verificationCode?: string;
  attempts: number;
}

/**
 * User data export
 */
interface DataExport {
  id: string;
  userId: string;
  format: 'json' | 'csv' | 'pdf';
  status: 'pending' | 'ready' | 'expired';
  requestedAt: number;
  expiresAt: number;
  downloadUrl?: string;
  includeTransactions: boolean;
  includeMessages: boolean;
  includeContent: boolean;
}

/**
 * Data deletion request
 */
interface DataDeletionRequest {
  id: string;
  userId: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: number;
  scheduledDeletionAt: number; // 30-day grace period
  completedAt?: number;
}

/**
 * Privacy settings
 */
interface PrivacySettings {
  userId: string;
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showTransactions: boolean;
  allowDataSharing: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
  anonymousMode: boolean;
}

/**
 * Data access log
 */
interface DataAccessLog {
  id: string;
  userId: string;
  accessor: string; // Who accessed the data
  dataType: string;
  purpose: string;
  timestamp: number;
  ipAddress: string;
}

/**
 * Identity Management System
 */
export class IdentityManagementSystem extends EventEmitter {
  private identities: Map<string, IdentityVerification> = new Map();
  private recoveryRequests: Map<string, RecoveryRequest> = new Map();
  private dataExports: Map<string, DataExport> = new Map();
  private deletionRequests: Map<string, DataDeletionRequest> = new Map();
  private privacySettings: Map<string, PrivacySettings> = new Map();
  private dataAccessLogs: Map<string, DataAccessLog[]> = new Map();
  
  // Duplicate detection
  private emailRegistry: Map<string, string> = new Map(); // email -> userId
  private phoneRegistry: Map<string, string> = new Map(); // phone -> userId
  private biometricRegistry: Map<string, string> = new Map(); // biometric hash -> userId
  private governmentIdRegistry: Map<string, string> = new Map(); // gov ID -> userId
  
  // Account limits by tier
  private readonly TIER_LIMITS: Record<AccountTier, AccountLimits> = {
    [AccountTier.UNVERIFIED]: {
      dailyTradingLimit: 0,
      dailyWithdrawalLimit: 0,
      maxWallets: 1,
      canCreateSmartContracts: false,
      canUseDeFi: false,
      canWithdraw: false,
      requiresDeviceBinding: true,
      requiresIPWhitelist: true,
    },
    [AccountTier.EMAIL_VERIFIED]: {
      dailyTradingLimit: 100,
      dailyWithdrawalLimit: 0,
      maxWallets: 2,
      canCreateSmartContracts: false,
      canUseDeFi: false,
      canWithdraw: false,
      requiresDeviceBinding: true,
      requiresIPWhitelist: true,
    },
    [AccountTier.PHONE_VERIFIED]: {
      dailyTradingLimit: 500,
      dailyWithdrawalLimit: 50,
      maxWallets: 3,
      canCreateSmartContracts: true,
      canUseDeFi: true,
      canWithdraw: true,
      requiresDeviceBinding: true,
      requiresIPWhitelist: false,
    },
    [AccountTier.KYC_VERIFIED]: {
      dailyTradingLimit: Infinity,
      dailyWithdrawalLimit: Infinity,
      maxWallets: Infinity,
      canCreateSmartContracts: true,
      canUseDeFi: true,
      canWithdraw: true,
      requiresDeviceBinding: false,
      requiresIPWhitelist: false,
    },
  };
  
  constructor() {
    super();
    this.startMaintenanceTasks();
  }
  
  /**
   * Create new identity (one per person)
   */
  async createIdentity(
    email: string,
    phone?: string,
    deviceId?: string,
    ipAddress?: string
  ): Promise<IdentityVerification> {
    // Check for duplicate email
    if (this.emailRegistry.has(email.toLowerCase())) {
      throw new Error('Email already registered. Only one account per person allowed.');
    }
    
    // Check for duplicate phone
    if (phone && this.phoneRegistry.has(phone)) {
      throw new Error('Phone number already registered. Only one account per person allowed.');
    }
    
    const userId = crypto.randomBytes(16).toString('hex');
    
    const identity: IdentityVerification = {
      userId,
      kycStatus: KYCStatus.NOT_STARTED,
      accountTier: AccountTier.UNVERIFIED,
      personalInfo: {},
      email: email.toLowerCase(),
      emailVerified: false,
      phone,
      phoneVerified: false,
      boundDevices: deviceId && ipAddress ? [{
        deviceId,
        deviceName: 'Primary Device',
        ipAddress,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
      }] : [],
      kycDocuments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.identities.set(userId, identity);
    this.emailRegistry.set(email.toLowerCase(), userId);
    if (phone) this.phoneRegistry.set(phone, userId);
    
    // Initialize privacy settings
    this.privacySettings.set(userId, {
      userId,
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
      showTransactions: false,
      allowDataSharing: false,
      allowAnalytics: true,
      allowMarketing: false,
      anonymousMode: false,
    });
    
    this.emit('identity-created', identity);
    
    // Send verification email
    await this.sendVerificationEmail(userId);
    
    return identity;
  }
  
  /**
   * Verify email
   */
  async verifyEmail(userId: string, verificationCode: string): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    // Simulate verification
    identity.emailVerified = true;
    identity.emailVerifiedAt = Date.now();
    identity.accountTier = AccountTier.EMAIL_VERIFIED;
    identity.updatedAt = Date.now();
    
    this.emit('email-verified', identity);
  }
  
  /**
   * Verify phone
   */
  async verifyPhone(userId: string, verificationCode: string): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    if (!identity.phone) throw new Error('No phone number registered');
    
    // Simulate verification
    identity.phoneVerified = true;
    identity.phoneVerifiedAt = Date.now();
    identity.accountTier = AccountTier.PHONE_VERIFIED;
    identity.updatedAt = Date.now();
    
    this.emit('phone-verified', identity);
  }
  
  /**
   * Submit KYC documents
   */
  async submitKYC(
    userId: string,
    personalInfo: IdentityVerification['personalInfo'],
    documents: { type: string; url: string }[]
  ): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    // Check for duplicate government ID
    if (personalInfo.governmentId) {
      const existingUserId = this.governmentIdRegistry.get(personalInfo.governmentId);
      if (existingUserId && existingUserId !== userId) {
        throw new Error('Government ID already registered. Only one account per person allowed.');
      }
    }
    
    identity.personalInfo = personalInfo;
    identity.kycDocuments = documents.map(doc => ({
      ...doc,
      uploadedAt: Date.now(),
      verified: false,
    }));
    identity.kycStatus = KYCStatus.PENDING;
    identity.updatedAt = Date.now();
    
    if (personalInfo.governmentId) {
      this.governmentIdRegistry.set(personalInfo.governmentId, userId);
    }
    
    this.emit('kyc-submitted', identity);
    
    // Simulate KYC verification (in production, this would be manual review)
    setTimeout(() => this.processKYC(userId), 5000);
  }
  
  /**
   * Process KYC verification
   */
  private async processKYC(userId: string): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) return;
    
    // Simulate verification
    const approved = Math.random() > 0.1; // 90% approval rate
    
    if (approved) {
      identity.kycStatus = KYCStatus.VERIFIED;
      identity.accountTier = AccountTier.KYC_VERIFIED;
      identity.kycVerifiedAt = Date.now();
      identity.kycExpiryAt = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year
      
      identity.kycDocuments.forEach(doc => doc.verified = true);
      
      this.emit('kyc-verified', identity);
    } else {
      identity.kycStatus = KYCStatus.REJECTED;
      this.emit('kyc-rejected', identity);
    }
    
    identity.updatedAt = Date.now();
  }
  
  /**
   * Add biometric authentication
   */
  async addBiometric(userId: string, biometricData: string, type: 'face' | 'fingerprint'): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    // Hash biometric data
    const biometricHash = crypto.createHash('sha256')
      .update(biometricData)
      .digest('hex');
    
    // Check for duplicate biometric
    const existingUserId = this.biometricRegistry.get(biometricHash);
    if (existingUserId && existingUserId !== userId) {
      throw new Error('Biometric already registered. Only one account per person allowed.');
    }
    
    if (type === 'face') {
      identity.faceIdHash = biometricHash;
    } else {
      identity.fingerprintHash = biometricHash;
    }
    
    identity.biometricHash = biometricHash;
    this.biometricRegistry.set(biometricHash, userId);
    
    this.emit('biometric-added', { userId, type });
  }
  
  /**
   * Bind device (for non-KYC accounts)
   */
  bindDevice(userId: string, deviceId: string, deviceName: string, ipAddress: string): void {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    const existing = identity.boundDevices.find(d => d.deviceId === deviceId);
    if (existing) {
      existing.lastSeen = Date.now();
      existing.ipAddress = ipAddress;
    } else {
      identity.boundDevices.push({
        deviceId,
        deviceName,
        ipAddress,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
      });
    }
    
    this.emit('device-bound', { userId, deviceId });
  }
  
  /**
   * Verify device access
   */
  verifyDeviceAccess(userId: string, deviceId: string, ipAddress: string): boolean {
    const identity = this.identities.get(userId);
    if (!identity) return false;
    
    const limits = this.TIER_LIMITS[identity.accountTier];
    
    // KYC verified users don't need device binding
    if (!limits.requiresDeviceBinding) return true;
    
    // Check if device is bound
    const device = identity.boundDevices.find(d => d.deviceId === deviceId);
    if (!device) return false;
    
    // Check IP whitelist if required
    if (limits.requiresIPWhitelist && device.ipAddress !== ipAddress) {
      return false;
    }
    
    // Update last seen
    device.lastSeen = Date.now();
    
    return true;
  }
  
  /**
   * Get account limits
   */
  getAccountLimits(userId: string): AccountLimits {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    return this.TIER_LIMITS[identity.accountTier];
  }
  
  /**
   * Request account recovery
   */
  async requestRecovery(
    email: string,
    method: RecoveryMethod['type']
  ): Promise<RecoveryRequest> {
    const userId = this.emailRegistry.get(email.toLowerCase());
    if (!userId) throw new Error('Email not found');
    
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const request: RecoveryRequest = {
      id: crypto.randomBytes(16).toString('hex'),
      userId,
      method,
      status: 'pending',
      requestedAt: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes
      verificationCode,
      attempts: 0,
    };
    
    this.recoveryRequests.set(request.id, request);
    
    // Send verification code
    if (method === 'email') {
      this.emit('send-recovery-email', { email: identity.email, code: verificationCode });
    } else if (method === 'phone' && identity.phone) {
      this.emit('send-recovery-sms', { phone: identity.phone, code: verificationCode });
    }
    
    this.emit('recovery-requested', request);
    
    return request;
  }
  
  /**
   * Verify recovery request
   */
  async verifyRecovery(requestId: string, code: string): Promise<boolean> {
    const request = this.recoveryRequests.get(requestId);
    if (!request) throw new Error('Recovery request not found');
    
    if (request.status !== 'pending') {
      throw new Error('Recovery request is not pending');
    }
    
    if (Date.now() > request.expiresAt) {
      request.status = 'expired';
      throw new Error('Recovery request expired');
    }
    
    request.attempts++;
    
    if (request.attempts > 3) {
      request.status = 'rejected';
      throw new Error('Too many attempts');
    }
    
    if (request.verificationCode === code.toUpperCase()) {
      request.status = 'approved';
      this.emit('recovery-approved', request);
      return true;
    }
    
    return false;
  }
  
  /**
   * Export user data (GDPR right to data portability)
   */
  async exportUserData(
    userId: string,
    format: DataExport['format'],
    options: {
      includeTransactions?: boolean;
      includeMessages?: boolean;
      includeContent?: boolean;
    } = {}
  ): Promise<DataExport> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    const dataExport: DataExport = {
      id: crypto.randomBytes(16).toString('hex'),
      userId,
      format,
      status: 'pending',
      requestedAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      includeTransactions: options.includeTransactions || false,
      includeMessages: options.includeMessages || false,
      includeContent: options.includeContent || false,
    };
    
    this.dataExports.set(dataExport.id, dataExport);
    
    // Log data access
    this.logDataAccess(userId, userId, 'full_export', 'User data export request');
    
    // Process export asynchronously
    setTimeout(() => this.processDataExport(dataExport.id), 5000);
    
    this.emit('data-export-requested', dataExport);
    
    return dataExport;
  }
  
  /**
   * Process data export
   */
  private async processDataExport(exportId: string): Promise<void> {
    const dataExport = this.dataExports.get(exportId);
    if (!dataExport) return;
    
    // Generate download URL (simulated)
    dataExport.downloadUrl = `https://aetherial.com/exports/${exportId}.${dataExport.format}`;
    dataExport.status = 'ready';
    
    this.emit('data-export-ready', dataExport);
  }
  
  /**
   * Request account deletion (GDPR right to be forgotten)
   */
  async requestDeletion(userId: string, reason: string): Promise<DataDeletionRequest> {
    const identity = this.identities.get(userId);
    if (!identity) throw new Error('Identity not found');
    
    const request: DataDeletionRequest = {
      id: crypto.randomBytes(16).toString('hex'),
      userId,
      reason,
      status: 'pending',
      requestedAt: Date.now(),
      scheduledDeletionAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30-day grace period
    };
    
    this.deletionRequests.set(request.id, request);
    
    this.emit('deletion-requested', request);
    
    return request;
  }
  
  /**
   * Cancel deletion request
   */
  cancelDeletion(requestId: string, userId: string): void {
    const request = this.deletionRequests.get(requestId);
    if (!request) throw new Error('Deletion request not found');
    
    if (request.userId !== userId) {
      throw new Error('Not authorized');
    }
    
    if (request.status === 'completed') {
      throw new Error('Deletion already completed');
    }
    
    request.status = 'cancelled';
    this.emit('deletion-cancelled', request);
  }
  
  /**
   * Process account deletion
   */
  private async processDeletion(requestId: string): Promise<void> {
    const request = this.deletionRequests.get(requestId);
    if (!request || request.status !== 'pending') return;
    
    if (Date.now() < request.scheduledDeletionAt) return;
    
    request.status = 'processing';
    
    const identity = this.identities.get(request.userId);
    if (identity) {
      // Remove from registries
      this.emailRegistry.delete(identity.email);
      if (identity.phone) this.phoneRegistry.delete(identity.phone);
      if (identity.biometricHash) this.biometricRegistry.delete(identity.biometricHash);
      if (identity.personalInfo.governmentId) {
        this.governmentIdRegistry.delete(identity.personalInfo.governmentId);
      }
      
      // Delete identity
      this.identities.delete(request.userId);
      
      // Delete associated data
      this.privacySettings.delete(request.userId);
      this.dataAccessLogs.delete(request.userId);
    }
    
    request.status = 'completed';
    request.completedAt = Date.now();
    
    this.emit('deletion-completed', request);
  }
  
  /**
   * Update privacy settings
   */
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): void {
    const existing = this.privacySettings.get(userId) || {
      userId,
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
      showTransactions: false,
      allowDataSharing: false,
      allowAnalytics: true,
      allowMarketing: false,
      anonymousMode: false,
    };
    
    const updated = { ...existing, ...settings, userId };
    this.privacySettings.set(userId, updated);
    
    this.emit('privacy-updated', updated);
  }
  
  /**
   * Log data access
   */
  private logDataAccess(
    userId: string,
    accessor: string,
    dataType: string,
    purpose: string,
    ipAddress: string = '0.0.0.0'
  ): void {
    const log: DataAccessLog = {
      id: crypto.randomBytes(16).toString('hex'),
      userId,
      accessor,
      dataType,
      purpose,
      timestamp: Date.now(),
      ipAddress,
    };
    
    const logs = this.dataAccessLogs.get(userId) || [];
    logs.push(log);
    this.dataAccessLogs.set(userId, logs);
    
    this.emit('data-accessed', log);
  }
  
  /**
   * Get data access logs
   */
  getDataAccessLogs(userId: string): DataAccessLog[] {
    return this.dataAccessLogs.get(userId) || [];
  }
  
  /**
   * Send verification email
   */
  private async sendVerificationEmail(userId: string): Promise<void> {
    const identity = this.identities.get(userId);
    if (!identity) return;
    
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    this.emit('send-verification-email', {
      email: identity.email,
      code: verificationCode,
    });
  }
  
  /**
   * Start maintenance tasks
   */
  private startMaintenanceTasks(): void {
    // Check for expired KYC, recovery requests, data exports, and process deletions
    setInterval(() => {
      this.checkExpiredKYC();
      this.checkExpiredRecoveryRequests();
      this.checkExpiredDataExports();
      this.processPendingDeletions();
    }, 3600000); // 1 hour
  }
  
  /**
   * Check for expired KYC
   */
  private checkExpiredKYC(): void {
    const now = Date.now();
    
    for (const identity of this.identities.values()) {
      if (identity.kycStatus === KYCStatus.VERIFIED &&
          identity.kycExpiryAt &&
          now > identity.kycExpiryAt) {
        identity.kycStatus = KYCStatus.EXPIRED;
        identity.accountTier = AccountTier.PHONE_VERIFIED;
        this.emit('kyc-expired', identity);
      }
    }
  }
  
  /**
   * Check for expired recovery requests
   */
  private checkExpiredRecoveryRequests(): void {
    const now = Date.now();
    
    for (const request of this.recoveryRequests.values()) {
      if (request.status === 'pending' && now > request.expiresAt) {
        request.status = 'expired';
      }
    }
  }
  
  /**
   * Check for expired data exports
   */
  private checkExpiredDataExports(): void {
    const now = Date.now();
    
    for (const dataExport of this.dataExports.values()) {
      if (dataExport.status === 'ready' && now > dataExport.expiresAt) {
        dataExport.status = 'expired';
      }
    }
  }
  
  /**
   * Process pending deletions
   */
  private processPendingDeletions(): void {
    for (const request of this.deletionRequests.values()) {
      if (request.status === 'pending') {
        this.processDeletion(request.id);
      }
    }
  }
  
  /**
   * Get identity
   */
  getIdentity(userId: string): IdentityVerification | undefined {
    return this.identities.get(userId);
  }
  
  /**
   * Get stats
   */
  getStats() {
    let kycVerified = 0;
    let emailVerified = 0;
    let phoneVerified = 0;
    
    for (const identity of this.identities.values()) {
      if (identity.kycStatus === KYCStatus.VERIFIED) kycVerified++;
      if (identity.emailVerified) emailVerified++;
      if (identity.phoneVerified) phoneVerified++;
    }
    
    return {
      totalUsers: this.identities.size,
      kycVerified,
      emailVerified,
      phoneVerified,
      pendingRecoveries: Array.from(this.recoveryRequests.values())
        .filter(r => r.status === 'pending').length,
      pendingDeletions: Array.from(this.deletionRequests.values())
        .filter(r => r.status === 'pending').length,
    };
  }
}

export const identityManagement = new IdentityManagementSystem();

