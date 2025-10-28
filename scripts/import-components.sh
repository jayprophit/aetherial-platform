#!/bin/bash

# Script to import existing components from Aetherial repository
# This copies and adapts the 418 existing components into the new platform

echo "=== Importing Components from Aetherial Repository ==="
echo ""

# Source and destination directories
SOURCE_DIR="/home/ubuntu/Aetherial"
DEST_DIR="/home/ubuntu/aetherial-platform/client/src/components/imported"

# Create destination directory structure
echo "Creating destination directories..."
mkdir -p "$DEST_DIR/ai"
mkdir -p "$DEST_DIR/blockchain"
mkdir -p "$DEST_DIR/social"
mkdir -p "$DEST_DIR/ecommerce"
mkdir -p "$DEST_DIR/elearning"
mkdir -p "$DEST_DIR/chat"
mkdir -p "$DEST_DIR/events"
mkdir -p "$DEST_DIR/business"
mkdir -p "$DEST_DIR/gamification"
mkdir -p "$DEST_DIR/jobs"
mkdir -p "$DEST_DIR/trading"
mkdir -p "$DEST_DIR/iot"
mkdir -p "$DEST_DIR/robotics"
mkdir -p "$DEST_DIR/quantum"
mkdir -p "$DEST_DIR/healthcare"
mkdir -p "$DEST_DIR/other"

echo "Directories created."
echo ""

# Copy AI Components
echo "Importing AI components..."
cp "$SOURCE_DIR/03 folder/AIComponents.jsx" "$DEST_DIR/ai/" 2>/dev/null || echo "  - AIComponents.jsx not found"

# Copy Blockchain Components
echo "Importing Blockchain components..."
cp "$SOURCE_DIR/03 folder/BlockchainComponents.jsx" "$DEST_DIR/blockchain/" 2>/dev/null || echo "  - BlockchainComponents.jsx not found"

# Copy Social/BuddyBoss Components
echo "Importing Social components..."
cp "$SOURCE_DIR/03 folder/BuddyBossComponents.jsx" "$DEST_DIR/social/" 2>/dev/null || echo "  - BuddyBossComponents.jsx not found"
cp "$SOURCE_DIR/03 folder/BuddyBossLayout.jsx" "$DEST_DIR/social/" 2>/dev/null || echo "  - BuddyBossLayout.jsx not found"
cp "$SOURCE_DIR/03 folder/BuddyBossNotifications.jsx" "$DEST_DIR/social/" 2>/dev/null || echo "  - BuddyBossNotifications.jsx not found"

# Copy E-Commerce Components
echo "Importing E-Commerce components..."
cp "$SOURCE_DIR/03 folder/EcommerceComponents.jsx" "$DEST_DIR/ecommerce/" 2>/dev/null || echo "  - EcommerceComponents.jsx not found"
cp "$SOURCE_DIR/03 folder/EcommerceComponents_1.jsx" "$DEST_DIR/ecommerce/" 2>/dev/null || echo "  - EcommerceComponents_1.jsx not found"
cp "$SOURCE_DIR/03 folder/EnhancedProductComponents.jsx" "$DEST_DIR/ecommerce/" 2>/dev/null || echo "  - EnhancedProductComponents.jsx not found"

# Copy E-Learning Components
echo "Importing E-Learning components..."
cp "$SOURCE_DIR/03 folder/ElearningComponents.jsx" "$DEST_DIR/elearning/" 2>/dev/null || echo "  - ElearningComponents.jsx not found"

# Copy Chat Components
echo "Importing Chat components..."
cp "$SOURCE_DIR/03 folder/ChatComponents.jsx" "$DEST_DIR/chat/" 2>/dev/null || echo "  - ChatComponents.jsx not found"

# Copy Event Components
echo "Importing Event components..."
cp "$SOURCE_DIR/03 folder/EventComponents.jsx" "$DEST_DIR/events/" 2>/dev/null || echo "  - EventComponents.jsx not found"

# Copy Business Components
echo "Importing Business components..."
cp "$SOURCE_DIR/03 folder/BusinessComponents.jsx" "$DEST_DIR/business/" 2>/dev/null || echo "  - BusinessComponents.jsx not found"

# Copy Gamification Components
echo "Importing Gamification components..."
cp "$SOURCE_DIR/03 folder/GamificationComponents.jsx" "$DEST_DIR/gamification/" 2>/dev/null || echo "  - GamificationComponents.jsx not found"

# Copy Job Components
echo "Importing Job components..."
cp "$SOURCE_DIR/03 folder/JobMarketplaceComponents.jsx" "$DEST_DIR/jobs/" 2>/dev/null || echo "  - JobMarketplaceComponents.jsx not found"

# Copy all remaining components from other folders
echo "Importing additional components..."
find "$SOURCE_DIR" -name "*.jsx" -o -name "*.tsx" | while read file; do
  filename=$(basename "$file")
  cp "$file" "$DEST_DIR/other/" 2>/dev/null
done

echo ""
echo "=== Import Complete ==="
echo ""
echo "Component count by directory:"
echo "  AI: $(find "$DEST_DIR/ai" -type f | wc -l)"
echo "  Blockchain: $(find "$DEST_DIR/blockchain" -type f | wc -l)"
echo "  Social: $(find "$DEST_DIR/social" -type f | wc -l)"
echo "  E-Commerce: $(find "$DEST_DIR/ecommerce" -type f | wc -l)"
echo "  E-Learning: $(find "$DEST_DIR/elearning" -type f | wc -l)"
echo "  Chat: $(find "$DEST_DIR/chat" -type f | wc -l)"
echo "  Events: $(find "$DEST_DIR/events" -type f | wc -l)"
echo "  Business: $(find "$DEST_DIR/business" -type f | wc -l)"
echo "  Gamification: $(find "$DEST_DIR/gamification" -type f | wc -l)"
echo "  Jobs: $(find "$DEST_DIR/jobs" -type f | wc -l)"
echo "  Other: $(find "$DEST_DIR/other" -type f | wc -l)"
echo ""
echo "Total imported: $(find "$DEST_DIR" -type f | wc -l)"

