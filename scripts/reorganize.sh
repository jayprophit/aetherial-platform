#!/bin/bash

# Aetherial Platform Reorganization Script
# This script runs the Python reorganization script and performs post-processing

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: Python 3.8 or later is required but not installed.${NC}"
        exit 1
    fi
    
    # Check Python version (3.8+ required)
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if [[ "$PYTHON_VERSION" < "3.8" ]]; then
        echo -e "${RED}Error: Python 3.8 or later is required. Found Python $PYTHON_VERSION${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Python $PYTHON_VERSION is installed${NC}"
}

# Install required Python packages
install_requirements() {
    echo -e "\n${YELLOW}Checking Python dependencies...${NC}"
    
    if ! python3 -c "import yaml" &> /dev/null; then
        echo -e "Installing PyYAML..."
        pip install pyyaml
    fi
    
    echo -e "${GREEN}✓ All dependencies are installed${NC}"
}

# Run the reorganization script
run_reorganization() {
    echo -e "\n${YELLOW}Starting platform reorganization...${NC}"
    
    # Get the directory of this script
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    PYTHON_SCRIPT="${SCRIPT_DIR}/reorganize_platform.py"
    
    # Run the Python script
    if ! python3 "$PYTHON_SCRIPT"; then
        echo -e "${RED}Error: Reorganization script failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Reorganization completed successfully${NC}"
}

# Post-reorganization steps
post_reorganization() {
    echo -e "\n${YELLOW}Running post-reorganization steps...${NC}"
    
    # Make scripts executable
    chmod +x scripts/*.sh
    
    # Update file permissions
    find . -type f -name "*.sh" -exec chmod +x {} \;
    
    echo -e "${GREEN}✓ Post-reorganization steps completed${NC}"
}

# Main function
main() {
    echo -e "${YELLOW}=== Aetherial Platform Reorganization ===${NC}\n"
    
    check_python
    install_requirements
    run_reorganization
    post_reorganization
    
    echo -e "\n${GREEN}Reorganization process completed successfully!${NC}"
    echo -e "\nNext steps:"
    echo -e "1. Review the changes:"
    echo -e "   git status"
    echo -e "2. Test the platform:"
    echo -e "   npm test"
    echo -e "3. Start the development environment:"
    echo -e "   npm run dev"
}

# Run the main function
main "$@"
