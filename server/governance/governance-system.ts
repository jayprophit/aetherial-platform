/**
 * AETHERIAL Governance & Personal AI Control System
 * 
 * Dual governance model:
 * 1. Personal AI Control - Users manage their own AI assistant
 * 2. Platform Governance - Mass voting for platform improvements
 * 
 * Features:
 * - Personal AI customization and oversight
 * - Democratic voting for non-core changes
 * - Proposal system
 * - Voting power based on stake/participation
 * - Admin oversight for core systems
 * - Amendment process
 * - Transparency and accountability
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Personal AI settings
 */
interface PersonalAISettings {
  userId: string;
  
  // Personality
  personality: {
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    humor: number; // 0-100
    verbosity: 'concise' | 'balanced' | 'detailed';
    formality: number; // 0-100
  };
  
  // Behavior
  behavior: {
    proactive: boolean; // Suggest actions without asking
    autonomous: boolean; // Make decisions automatically
    learningEnabled: boolean; // Learn from interactions
    privacyMode: 'strict' | 'balanced' | 'open';
  };
  
  // Capabilities
  capabilities: {
    trading: {
      enabled: boolean;
      maxAmount: number;
      requireApproval: boolean;
    };
    spending: {
      enabled: boolean;
      dailyLimit: number;
      requireApproval: boolean;
    };
    socialInteraction: {
      enabled: boolean;
      autoReply: boolean;
      requireApproval: boolean;
    };
    contentCreation: {
      enabled: boolean;
      autoPost: boolean;
      requireApproval: boolean;
    };
  };
  
  // Restrictions
  restrictions: {
    blockedTopics: string[];
    blockedActions: string[];
    timeRestrictions: {
      startHour: number;
      endHour: number;
    };
  };
  
  // Audit
  auditLog: boolean; // Log all AI actions
  requireExplanation: boolean; // AI must explain decisions
  
  updatedAt: number;
}

/**
 * AI action log
 */
interface AIActionLog {
  id: string;
  userId: string;
  action: string;
  category: string;
  parameters: any;
  result: any;
  explanation: string;
  approved: boolean;
  timestamp: number;
}

/**
 * Governance proposal
 */
interface GovernanceProposal {
  id: string;
  proposerId: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'policy' | 'parameter';
  
  // Proposal details
  changes: {
    type: string;
    current: any;
    proposed: any;
  }[];
  
  // Voting
  votingStarted: number;
  votingEnds: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  voters: Set<string>;
  
  // Requirements
  quorumRequired: number; // Minimum participation %
  approvalThreshold: number; // % needed to pass
  
  // Status
  status: 'draft' | 'voting' | 'passed' | 'rejected' | 'implemented' | 'cancelled';
  
  // Core system protection
  affectsCoreSystem: boolean;
  adminApprovalRequired: boolean;
  adminApproved?: boolean;
  
  // Implementation
  implementationDate?: number;
  
  createdAt: number;
  updatedAt: number;
}

/**
 * Vote
 */
interface Vote {
  proposalId: string;
  userId: string;
  choice: 'for' | 'against' | 'abstain';
  votingPower: number;
  reason?: string;
  timestamp: number;
}

/**
 * Voting power calculation
 */
interface VotingPower {
  userId: string;
  baseVotes: number; // 1 per user
  stakeVotes: number; // Based on AETH holdings
  participationVotes: number; // Based on platform activity
  reputationVotes: number; // Based on community reputation
  totalVotes: number;
}

/**
 * Amendment
 */
interface Amendment {
  id: string;
  proposalId: string;
  proposerId: string;
  description: string;
  changes: any;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    userId: string;
    approved: boolean;
  }[];
  createdAt: number;
}

/**
 * Governance System
 */
export class GovernanceSystem extends EventEmitter {
  private personalAISettings: Map<string, PersonalAISettings> = new Map();
  private aiActionLogs: Map<string, AIActionLog[]> = new Map(); // userId -> logs
  private proposals: Map<string, GovernanceProposal> = new Map();
  private votes: Map<string, Vote[]> = new Map(); // proposalId -> votes
  private amendments: Map<string, Amendment> = new Map();
  private votingPower: Map<string, VotingPower> = new Map();
  
  // Governance parameters
  private readonly VOTING_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly QUORUM_REQUIRED = 10; // 10% participation
  private readonly APPROVAL_THRESHOLD = 66; // 66% approval needed
  
  // Core system protection
  private readonly CORE_SYSTEMS = [
    'blockchain',
    'consensus',
    'security',
    'identity',
    'financial',
  ];
  
  constructor() {
    super();
    this.startGovernanceMonitoring();
  }
  
  /**
   * Initialize personal AI settings
   */
  initializePersonalAI(userId: string): PersonalAISettings {
    const settings: PersonalAISettings = {
      userId,
      personality: {
        tone: 'friendly',
        humor: 50,
        verbosity: 'balanced',
        formality: 50,
      },
      behavior: {
        proactive: false,
        autonomous: false,
        learningEnabled: true,
        privacyMode: 'balanced',
      },
      capabilities: {
        trading: {
          enabled: false,
          maxAmount: 0,
          requireApproval: true,
        },
        spending: {
          enabled: false,
          dailyLimit: 0,
          requireApproval: true,
        },
        socialInteraction: {
          enabled: true,
          autoReply: false,
          requireApproval: true,
        },
        contentCreation: {
          enabled: true,
          autoPost: false,
          requireApproval: true,
        },
      },
      restrictions: {
        blockedTopics: [],
        blockedActions: [],
        timeRestrictions: {
          startHour: 0,
          endHour: 24,
        },
      },
      auditLog: true,
      requireExplanation: true,
      updatedAt: Date.now(),
    };
    
    this.personalAISettings.set(userId, settings);
    this.emit('personal-ai-initialized', settings);
    
    return settings;
  }
  
  /**
   * Update personal AI settings
   */
  updatePersonalAI(userId: string, updates: Partial<PersonalAISettings>): PersonalAISettings {
    let settings = this.personalAISettings.get(userId);
    if (!settings) {
      settings = this.initializePersonalAI(userId);
    }
    
    // Deep merge updates
    settings = {
      ...settings,
      ...updates,
      userId,
      updatedAt: Date.now(),
    };
    
    this.personalAISettings.set(userId, settings);
    this.emit('personal-ai-updated', settings);
    
    return settings;
  }
  
  /**
   * Log AI action
   */
  logAIAction(
    userId: string,
    action: string,
    category: string,
    parameters: any,
    result: any,
    explanation: string,
    approved: boolean = true
  ): AIActionLog {
    const log: AIActionLog = {
      id: crypto.randomBytes(16).toString('hex'),
      userId,
      action,
      category,
      parameters,
      result,
      explanation,
      approved,
      timestamp: Date.now(),
    };
    
    const userLogs = this.aiActionLogs.get(userId) || [];
    userLogs.push(log);
    this.aiActionLogs.set(userId, userLogs);
    
    this.emit('ai-action-logged', log);
    
    return log;
  }
  
  /**
   * Get AI action logs
   */
  getAIActionLogs(userId: string, limit: number = 100): AIActionLog[] {
    const logs = this.aiActionLogs.get(userId) || [];
    return logs.slice(-limit);
  }
  
  /**
   * Create governance proposal
   */
  createProposal(
    proposerId: string,
    title: string,
    description: string,
    category: GovernanceProposal['category'],
    changes: GovernanceProposal['changes']
  ): GovernanceProposal {
    // Check if proposal affects core systems
    const affectsCoreSystem = changes.some(change =>
      this.CORE_SYSTEMS.some(core => change.type.toLowerCase().includes(core))
    );
    
    const proposal: GovernanceProposal = {
      id: crypto.randomBytes(16).toString('hex'),
      proposerId,
      title,
      description,
      category,
      changes,
      votingStarted: Date.now(),
      votingEnds: Date.now() + this.VOTING_DURATION,
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      voters: new Set(),
      quorumRequired: this.QUORUM_REQUIRED,
      approvalThreshold: this.APPROVAL_THRESHOLD,
      status: 'voting',
      affectsCoreSystem,
      adminApprovalRequired: affectsCoreSystem,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.proposals.set(proposal.id, proposal);
    this.emit('proposal-created', proposal);
    
    return proposal;
  }
  
  /**
   * Calculate voting power
   */
  calculateVotingPower(userId: string, stake: number, participation: number, reputation: number): VotingPower {
    const baseVotes = 1;
    const stakeVotes = Math.floor(stake / 1000); // 1 vote per 1000 AETH
    const participationVotes = Math.floor(participation / 100); // 1 vote per 100 actions
    const reputationVotes = Math.floor(reputation / 50); // 1 vote per 50 reputation
    
    const power: VotingPower = {
      userId,
      baseVotes,
      stakeVotes,
      participationVotes,
      reputationVotes,
      totalVotes: baseVotes + stakeVotes + participationVotes + reputationVotes,
    };
    
    this.votingPower.set(userId, power);
    
    return power;
  }
  
  /**
   * Cast vote
   */
  castVote(
    proposalId: string,
    userId: string,
    choice: Vote['choice'],
    reason?: string
  ): Vote {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    if (proposal.status !== 'voting') {
      throw new Error('Proposal is not open for voting');
    }
    
    if (Date.now() > proposal.votingEnds) {
      throw new Error('Voting period has ended');
    }
    
    if (proposal.voters.has(userId)) {
      throw new Error('User has already voted');
    }
    
    // Get voting power
    const power = this.votingPower.get(userId) || { totalVotes: 1 } as VotingPower;
    
    const vote: Vote = {
      proposalId,
      userId,
      choice,
      votingPower: power.totalVotes,
      reason,
      timestamp: Date.now(),
    };
    
    // Update proposal
    proposal.voters.add(userId);
    
    switch (choice) {
      case 'for':
        proposal.votesFor += power.totalVotes;
        break;
      case 'against':
        proposal.votesAgainst += power.totalVotes;
        break;
      case 'abstain':
        proposal.votesAbstain += power.totalVotes;
        break;
    }
    
    // Store vote
    const proposalVotes = this.votes.get(proposalId) || [];
    proposalVotes.push(vote);
    this.votes.set(proposalId, proposalVotes);
    
    this.emit('vote-cast', vote);
    
    // Check if voting should end early (overwhelming majority)
    this.checkEarlyVotingEnd(proposal);
    
    return vote;
  }
  
  /**
   * Check if voting can end early
   */
  private checkEarlyVotingEnd(proposal: GovernanceProposal): void {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    
    // If 90% voted for, end early
    if (totalVotes > 0 && (proposal.votesFor / totalVotes) >= 0.9) {
      this.finalizeProposal(proposal.id);
    }
    
    // If 90% voted against, end early
    if (totalVotes > 0 && (proposal.votesAgainst / totalVotes) >= 0.9) {
      this.finalizeProposal(proposal.id);
    }
  }
  
  /**
   * Finalize proposal
   */
  private finalizeProposal(proposalId: string): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return;
    
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    const totalUsers = this.personalAISettings.size; // Approximate
    const participation = (proposal.voters.size / totalUsers) * 100;
    
    // Check quorum
    if (participation < proposal.quorumRequired) {
      proposal.status = 'rejected';
      this.emit('proposal-rejected', { proposal, reason: 'Quorum not met' });
      return;
    }
    
    // Check approval threshold
    const approvalRate = (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100;
    
    if (approvalRate >= proposal.approvalThreshold) {
      // Check if admin approval needed
      if (proposal.adminApprovalRequired && !proposal.adminApproved) {
        this.emit('proposal-awaiting-admin', proposal);
      } else {
        proposal.status = 'passed';
        this.emit('proposal-passed', proposal);
        
        // Schedule implementation
        this.scheduleImplementation(proposal);
      }
    } else {
      proposal.status = 'rejected';
      this.emit('proposal-rejected', { proposal, reason: 'Approval threshold not met' });
    }
  }
  
  /**
   * Admin approval for core system changes
   */
  adminApproveProposal(proposalId: string, adminId: string, approved: boolean): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    if (!proposal.adminApprovalRequired) {
      throw new Error('Proposal does not require admin approval');
    }
    
    proposal.adminApproved = approved;
    
    if (approved) {
      proposal.status = 'passed';
      this.emit('proposal-admin-approved', { proposal, adminId });
      this.scheduleImplementation(proposal);
    } else {
      proposal.status = 'rejected';
      this.emit('proposal-admin-rejected', { proposal, adminId });
    }
  }
  
  /**
   * Schedule proposal implementation
   */
  private scheduleImplementation(proposal: GovernanceProposal): void {
    // Schedule for 24 hours later to allow for final review
    proposal.implementationDate = Date.now() + (24 * 60 * 60 * 1000);
    
    this.emit('proposal-scheduled', proposal);
  }
  
  /**
   * Create amendment
   */
  createAmendment(
    proposalId: string,
    proposerId: string,
    description: string,
    changes: any
  ): Amendment {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    const amendment: Amendment = {
      id: crypto.randomBytes(16).toString('hex'),
      proposalId,
      proposerId,
      description,
      changes,
      status: 'pending',
      votes: [],
      createdAt: Date.now(),
    };
    
    this.amendments.set(amendment.id, amendment);
    this.emit('amendment-created', amendment);
    
    return amendment;
  }
  
  /**
   * Vote on amendment
   */
  voteOnAmendment(amendmentId: string, userId: string, approved: boolean): void {
    const amendment = this.amendments.get(amendmentId);
    if (!amendment) throw new Error('Amendment not found');
    
    amendment.votes.push({ userId, approved });
    
    // Check if amendment should be approved (simple majority)
    const approvals = amendment.votes.filter(v => v.approved).length;
    const rejections = amendment.votes.filter(v => !v.approved).length;
    
    if (approvals > rejections && approvals >= 3) {
      amendment.status = 'approved';
      
      // Update original proposal
      const proposal = this.proposals.get(amendment.proposalId);
      if (proposal) {
        proposal.changes.push(...amendment.changes);
        proposal.updatedAt = Date.now();
      }
      
      this.emit('amendment-approved', amendment);
    } else if (rejections > approvals && rejections >= 3) {
      amendment.status = 'rejected';
      this.emit('amendment-rejected', amendment);
    }
  }
  
  /**
   * Start governance monitoring
   */
  private startGovernanceMonitoring(): void {
    // Check proposals every hour
    setInterval(() => {
      this.checkProposalDeadlines();
      this.implementScheduledProposals();
    }, 3600000); // 1 hour
  }
  
  /**
   * Check proposal deadlines
   */
  private checkProposalDeadlines(): void {
    const now = Date.now();
    
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'voting' && now > proposal.votingEnds) {
        this.finalizeProposal(proposal.id);
      }
    }
  }
  
  /**
   * Implement scheduled proposals
   */
  private implementScheduledProposals(): void {
    const now = Date.now();
    
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'passed' && 
          proposal.implementationDate && 
          now >= proposal.implementationDate) {
        
        proposal.status = 'implemented';
        this.emit('proposal-implemented', proposal);
      }
    }
  }
  
  /**
   * Get personal AI settings
   */
  getPersonalAISettings(userId: string): PersonalAISettings | undefined {
    return this.personalAISettings.get(userId);
  }
  
  /**
   * Get active proposals
   */
  getActiveProposals(): GovernanceProposal[] {
    return Array.from(this.proposals.values())
      .filter(p => p.status === 'voting')
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  /**
   * Get stats
   */
  getStats() {
    let activeProposals = 0;
    let passedProposals = 0;
    let rejectedProposals = 0;
    
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'voting') activeProposals++;
      if (proposal.status === 'passed' || proposal.status === 'implemented') passedProposals++;
      if (proposal.status === 'rejected') rejectedProposals++;
    }
    
    return {
      totalUsers: this.personalAISettings.size,
      totalProposals: this.proposals.size,
      activeProposals,
      passedProposals,
      rejectedProposals,
      totalVotes: Array.from(this.votes.values()).flat().length,
      totalAmendments: this.amendments.size,
    };
  }
}

export const governanceSystem = new GovernanceSystem();

