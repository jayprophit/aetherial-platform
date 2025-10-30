#!/bin/bash

# Windsurf post-deployment hook
# This script moves any Windsurf-generated files to the whats_missing_and_needed directory

TARGET_DIR="whats_missing_and_needed/windsurf_artifacts/$(date +%Y%m%d_%H%M%S)"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Find and move Windsurf-related files
find . -maxdepth 1 -type f -name "*.windsurf*" -exec mv {} "$TARGET_DIR/" \;
find . -maxdepth 1 -type d -name "*windsurf*" -exec mv {} "$TARGET_DIR/" \;

# Check if there were any files moved
if [ "$(ls -A $TARGET_DIR)" ]; then
    echo "Moved Windsurf files to $TARGET_DIR"
    ls -la "$TARGET_DIR"
else
    echo "No Windsurf files found to move"
    rmdir "$TARGET_DIR"
fi
