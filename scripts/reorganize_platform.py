#!/usr/bin/env python3
"""
Aetherial Platform Reorganization Script

This script automates the reorganization of the whats_missing_and_needed directory
into the main project structure based on predefined mapping rules.
"""

import os
import shutil
from pathlib import Path
import yaml

# Base directories
ROOT_DIR = Path(__file__).parent.parent
SRC_DIR = ROOT_DIR / "whats_missing_and_needed"
DEST_DIR = ROOT_DIR

# Mapping of source directories to destination directories
DIRECTORY_MAPPING = {
    "ai_implementation": "server/ai",
    "ai_testing": "tests/ai",
    "api-gateway": "server/api-gateway",
    "auth-service": "server/auth",
    "blockchain": "contracts",
    "cross_platform": "shared",
    "kubernetes": "k8s",
    "monitoring": "monitoring",
    "scripts": "scripts",
    "docs": "docs",
}

# File mapping for root level files
FILE_MAPPING = {
    "BLT_IMPLEMENTATION_PLAN.md": "docs/development/BLT_IMPLEMENTATION_PLAN.md",
    "MANIFEST.md": "docs/operations/MANIFEST.md",
    "MANUS_INTEGRATION.md": "docs/integrations/MANUS_INTEGRATION.md",
    "PLATFORM_ARCHITECTURE.md": "docs/architecture/PLATFORM_ARCHITECTURE.md",
    "production_analysis.md": "docs/analysis/production_analysis.md",
    "technical_requirements.md": "docs/requirements/technical_requirements.md",
    "deploy.sh": "scripts/deploy.sh",
}

# Special handling for specific files/directories
SPECIAL_HANDLING = {
    "kubernetes/production": {
        "dest": "k8s/production",
        "merge": True  # Merge with existing directory
    },
    "ai_implementation/1_core_infrastructure": {
        "dest": "server/ai/infrastructure",
        "merge": True
    },
    "ai_implementation/2_ai_services": {
        "dest": "server/ai/services",
        "merge": True
    },
    "blockchain/smart_contracts": {
        "dest": "contracts/src",
        "merge": True
    }
}

def ensure_directory(path):
    """Ensure directory exists, create if it doesn't."""
    path.mkdir(parents=True, exist_ok=True)

def copy_file(src, dest):
    """Copy file from src to dest, creating parent directories if needed."""
    ensure_directory(dest.parent)
    shutil.copy2(src, dest)
    print(f"Copied: {src} -> {dest}")

def merge_directories(src, dest):
    """Merge contents of src directory into dest directory."""
    ensure_directory(dest)
    
    for item in os.listdir(src):
        src_path = src / item
        dest_path = dest / item
        
        if src_path.is_dir():
            if dest_path.exists() and dest_path.is_dir():
                merge_directories(src_path, dest_path)
            else:
                shutil.copytree(src_path, dest_path)
                print(f"Copied directory: {src_path} -> {dest_path}")
        else:
            shutil.copy2(src_path, dest_path)
            print(f"Copied file: {src_path} -> {dest_path}")

def process_directory_mapping():
    """Process the directory mapping to reorganize files."""
    for src_rel, dest_rel in DIRECTORY_MAPPING.items():
        src = SRC_DIR / src_rel
        dest = DEST_DIR / dest_rel
        
        if not src.exists():
            print(f"Warning: Source directory not found: {src}")
            continue
            
        if src_rel in SPECIAL_HANDLING:
            handle = SPECIAL_HANDLING[src_rel]
            dest = DEST_DIR / handle["dest"]
            if handle.get("merge", False):
                merge_directories(src, dest)
            else:
                if dest.exists():
                    shutil.rmtree(dest)
                shutil.copytree(src, dest)
                print(f"Copied directory with special handling: {src} -> {dest}")
        else:
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(src, dest)
            print(f"Copied directory: {src} -> {dest}")

def process_file_mapping():
    """Process the file mapping to reorganize individual files."""
    for src_file, dest_file in FILE_MAPPING.items():
        src = SRC_DIR / src_file
        dest = DEST_DIR / dest_file
        
        if not src.exists():
            print(f"Warning: Source file not found: {src}")
            continue
            
        copy_file(src, dest)

def process_special_handling():
    """Process special handling rules."""
    for rel_path, config in SPECIAL_HANDLING.items():
        if "file" in config:  # For file-specific handling if needed
            src = SRC_DIR / rel_path / config["file"]
            dest = DEST_DIR / config["dest"]
            if src.exists():
                copy_file(src, dest)

def main():
    print("Starting Aetherial Platform reorganization...")
    
    # Process directory mappings
    print("\nProcessing directory mappings...")
    process_directory_mapping()
    
    # Process file mappings
    print("\nProcessing file mappings...")
    process_file_mapping()
    
    # Process special handling
    print("\nProcessing special handling...")
    process_special_handling()
    
    print("\nReorganization complete!")

if __name__ == "__main__":
    main()
