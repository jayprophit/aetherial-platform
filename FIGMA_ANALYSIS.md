# Figma Design Analysis - Top Bar Requirements

## Overview
Based on the Figma design images provided, the top bar needs to include comprehensive submenu icons and three-dot menu options for each main navigation item.

## Top Bar Structure Requirements

### 1. Main Navigation Icons (Left Sidebar)
Each main menu item should have:
- **Icon** (visual representation)
- **Label** (text description)
- **Active state** (highlighted when selected)
- **Submenu indicator** (chevron or arrow)

### 2. Top Bar Submenus
When a main menu item is selected, the top bar should display:

#### Activity Feed Submenu
- **Feed** icon + label
- **Trending** icon + label
- **Following** icon + label
- **Saved** icon + label
- **Three-dot menu** with options:
  - Settings
  - Privacy
  - Notifications
  - Help

#### Friends Submenu
- **All Friends** icon + label
- **Requests** icon + label
- **Suggestions** icon + label
- **Blocked** icon + label
- **Three-dot menu** with options:
  - Find Friends
  - Import Contacts
  - Settings
  - Privacy

#### Groups Submenu
- **My Groups** icon + label
- **Discover** icon + label
- **Create Group** icon + label
- **Invitations** icon + label
- **Three-dot menu** with options:
  - Group Settings
  - Manage Members
  - Notifications
  - Help

#### Messages Submenu
- **Inbox** icon + label
- **Sent** icon + label
- **Archived** icon + label
- **Starred** icon + label
- **Three-dot menu** with options:
  - New Message
  - Mark All Read
  - Settings
  - Help

#### Marketplace Submenu
- **Browse** icon + label
- **Categories** icon + label
- **My Shop** icon + label
- **Orders** icon + label
- **Cart** icon + label
- **Three-dot menu** with options:
  - Sell Product
  - My Listings
  - Analytics
  - Settings

#### Learning Submenu
- **Courses** icon + label
- **My Learning** icon + label
- **Certificates** icon + label
- **Teach** icon + label
- **Three-dot menu** with options:
  - Create Course
  - Student Dashboard
  - Instructor Dashboard
  - Settings

#### Jobs Submenu
- **Browse Jobs** icon + label
- **My Applications** icon + label
- **Saved Jobs** icon + label
- **Post Job** icon + label
- **Three-dot menu** with options:
  - Resume Builder
  - Job Alerts
  - Company Reviews
  - Settings

#### AI Agents Submenu
- **Chat** icon + label
- **Agents** icon + label
- **Create Agent** icon + label
- **Marketplace** icon + label
- **Three-dot menu** with options:
  - Agent Settings
  - API Keys
  - Usage Stats
  - Help

#### Wallet Submenu
- **Overview** icon + label
- **Transactions** icon + label
- **Send** icon + label
- **Receive** icon + label
- **Three-dot menu** with options:
  - Add Funds
  - Withdraw
  - Security
  - Settings

#### Trading Submenu
- **Markets** icon + label
- **Portfolio** icon + label
- **Orders** icon + label
- **History** icon + label
- **Three-dot menu** with options:
  - Deposit
  - Withdraw
  - Settings
  - Help

#### NFT Marketplace Submenu
- **Explore** icon + label
- **My NFTs** icon + label
- **Create** icon + label
- **Activity** icon + label
- **Three-dot menu** with options:
  - Mint NFT
  - Collections
  - Analytics
  - Settings

#### IoT Submenu
- **Devices** icon + label
- **Dashboard** icon + label
- **Automation** icon + label
- **Analytics** icon + label
- **Three-dot menu** with options:
  - Add Device
  - Settings
  - Security
  - Help

#### Robotics Submenu
- **Robots** icon + label
- **Control** icon + label
- **Programs** icon + label
- **Monitoring** icon + label
- **Three-dot menu** with options:
  - Add Robot
  - Settings
  - Diagnostics
  - Help

#### Governance Submenu
- **Proposals** icon + label
- **Voting** icon + label
- **Treasury** icon + label
- **Members** icon + label
- **Three-dot menu** with options:
  - Create Proposal
  - Delegate
  - Settings
  - Help

## Design Specifications

### Icon Requirements
- **Size:** 20x20px (consistent across all icons)
- **Style:** Outline style with 2px stroke
- **Color:** 
  - Default: `#64748b` (slate-500)
  - Active: `#00D9FF` (ethereal cyan)
  - Hover: `#00B8D4` (darker cyan)

### Three-Dot Menu
- **Icon:** MoreVertical (three vertical dots)
- **Position:** Far right of submenu bar
- **Dropdown:** 
  - Width: 200px
  - Background: White (light mode) / `#1A2332` (dark mode)
  - Border radius: 8px
  - Shadow: `0 4px 12px rgba(0, 0, 0, 0.1)`
  - Padding: 8px
  - Item height: 40px
  - Item hover: `#f1f5f9` (light) / `#2d3748` (dark)

### Submenu Bar
- **Height:** 56px
- **Background:** White (light mode) / `#1A2332` (dark mode)
- **Border bottom:** 1px solid `#e2e8f0` (light) / `#2d3748` (dark)
- **Padding:** 0 24px
- **Items spacing:** 24px gap between items

### Responsive Behavior
- **Desktop (>1024px):** Show all submenu items with icons and labels
- **Tablet (768px-1024px):** Show icons only, labels on hover
- **Mobile (<768px):** Collapse into dropdown menu

## Implementation Priority

1. **High Priority:**
   - Add submenu icons to all main sections
   - Implement three-dot menu dropdowns
   - Add proper active states
   - Ensure responsive behavior

2. **Medium Priority:**
   - Add hover animations
   - Implement keyboard navigation
   - Add tooltips for icon-only mode

3. **Low Priority:**
   - Add submenu search functionality
   - Implement customizable submenu order
   - Add keyboard shortcuts display

## Notes
- All icons should use lucide-react library for consistency
- Animations should use CSS transitions (200ms ease-in-out)
- Ensure ARIA labels for accessibility
- Test with keyboard navigation
- Verify color contrast ratios (WCAG AA compliance)

