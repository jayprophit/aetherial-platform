#!/usr/bin/env python3
"""
Aetherial Platform - Cleanup Script for whats_missing_and_needed

This script moves all remaining files from whats_missing_and_needed to their
correct locations in the project structure.
"""

import os
import shutil
from pathlib import Path

# Base directories
ROOT_DIR = Path(__file__).parent.parent
SRC_DIR = ROOT_DIR / "whats_missing_and_needed"

# Mapping of source to destination paths
MAPPING = {
    ".github/": ".github/",
    "BLT_IMPLEMENTATION_PLAN.md": "docs/development/BLT_IMPLEMENTATION_PLAN.md",
    "MANIFEST.md": "docs/operations/MANIFEST.md",
    "MANUS_INTEGRATION.md": "docs/integrations/MANUS_INTEGRATION.md",
    "PLATFORM_ARCHITECTURE.md": "docs/architecture/PLATFORM_ARCHITECTURE.md",
    "production_analysis.md": "docs/analysis/production_analysis.md",
    "technical_requirements.md": "docs/requirements/technical_requirements.md",
    "deploy.sh": "scripts/deploy.sh",
    "ai_implementation/": "server/ai/",
    "ai_testing/": "tests/ai/",
    "api-gateway/": "server/api-gateway/",
    "auth-service/": "server/auth/",
    "blockchain/": "contracts/",
    "cross_platform/": "shared/",
    "dapp_testing/": "tests/dapp/",
    "kubernetes/": "k8s/",
    "low_precision_training/": "server/ai/training/low_precision/",
    "monitoring/": "monitoring/",
    "robotics/": "server/robotics/",
    "windsurf_artifacts/": "build/artifacts/"
}

def ensure_directory(path):
    """Ensure directory exists, create if it doesn't."""
    path.mkdir(parents=True, exist_ok=True)

def move_item(src, dest):
    """Move a file or directory from src to dest."""
    src_path = Path(src)
    dest_path = Path(dest)
    
    if not src_path.exists():
        print(f"Warning: Source not found: {src_path}")
        return
        
    # Ensure parent directory exists
    ensure_directory(dest_path.parent)
    
    # If destination exists, handle accordingly
    if dest_path.exists():
        if dest_path.is_dir() and src_path.is_dir():
            # Merge directories
            for item in src_path.glob('*'):
                shutil.move(str(item), str(dest_path / item.name))
            print(f"Merged directory: {src_path} -> {dest_path}")
            return
        else:
            # Remove existing file/directory
            if dest_path.is_dir():
                shutil.rmtree(dest_path)
            else:
                dest_path.unlink()
    
    # Move the item
    shutil.move(str(src_path), str(dest_path))
    print(f"Moved: {src_path} -> {dest_path}")

def main():
    print("Starting cleanup of whats_missing_and_needed...\n")
    
    # Process all items in the mapping
    for src_rel, dest_rel in MAPPING.items():
        src = SRC_DIR / src_rel
        dest = ROOT_DIR / dest_rel
        
        if not src.exists():
            print(f"Warning: Source not found: {src}")
            continue
            
        move_item(src, dest)
    
    # Remove empty directories
    try:
        for root, dirs, files in os.walk(SRC_DIR, topdown=False):
            for dir_name in dirs:
                dir_path = Path(root) / dir_name
                try:
                    dir_path.rmdir()
                    print(f"Removed empty directory: {dir_path}")
                except OSError:
                    pass  # Directory not empty
        
        # Remove the whats_missing_and_needed directory if empty
        if not any(SRC_DIR.iterdir()):
            SRC_DIR.rmdir()
            print(f"\nRemoved empty directory: {SRC_DIR}")
    except Exception as e:
        print(f"Error during cleanup: {e}")
    
    print("\nCleanup complete!")

if __name__ == "__main__":
    main()
