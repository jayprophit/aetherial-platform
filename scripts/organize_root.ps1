# Script to organize files in the root directory

# Base paths
$rootDir = $PSScriptRoot
$docsDir = Join-Path $rootDir "docs"

# Create necessary directories if they don't exist
$targetDirs = @(
    "docs/architecture",
    "docs/development",
    "docs/deployment",
    "docs/api",
    "docs/guides",
    "docs/tutorials",
    "docs/roadmaps",
    "docs/specifications",
    "docs/root"
)

foreach ($dir in $targetDirs) {
    $fullPath = Join-Path $rootDir $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

# Files to keep in root (case-insensitive)
$keepInRoot = @(
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "CHANGELOG.md",
    "package.json",
    "package-lock.json",
    "yarn.lock",
    "tsconfig.json",
    ".gitignore",
    ".gitattributes",
    ".prettierrc",
    ".eslintrc",
    ".editorconfig",
    "mkdocs.yml",
    "docs-requirements.txt"
) | ForEach-Object { $_.ToLower() }

# File patterns and their target directories
$filePatterns = @{
    # Architecture
    "*ARCHITECTURE*.md" = "architecture"
    "*AI_ARCHITECTURE*.md" = "architecture"
    "*BLOCKCHAIN_*.md" = "architecture"
    "*PLATFORM_ARCHITECTURE*.md" = "architecture"
    
    # Development
    "DEVELOPMENT*.md" = "development"
    "CODING_*.md" = "development"
    "TESTING*.md" = "development"
    "DEBUGGING*.md" = "development"
    "BUILD*.md" = "development"
    
    # Deployment
    "DEPLOYMENT*.md" = "deployment"
    "PRODUCTION*.md" = "deployment"
    "DOCKER*.md" = "deployment"
    "KUBERNETES*.md" = "deployment"
    "K8S*.md" = "deployment"
    "CI_CD*.md" = "deployment"
    
    # API
    "API_*.md" = "api"
    "REST_*.md" = "api"
    "GRAPHQL*.md" = "api"
    "SWAGGER*.md" = "api"
    "OPENAPI*.md" = "api"
    
    # Guides & Tutorials
    "GUIDE*.md" = "guides"
    "HOW_TO_*.md" = "guides"
    "TUTORIAL*.md" = "tutorials"
    "GETTING_STARTED*.md" = "tutorials"
    
    # Roadmaps & Plans
    "ROADMAP*.md" = "roadmaps"
    "PLAN*.md" = "roadmaps"
    "TIMELINE*.md" = "roadmaps"
    "MILESTONE*.md" = "roadmaps"
    
    # Specifications
    "SPEC*.md" = "specifications"
    "REQUIREMENT*.md" = "specifications"
    "AETHERIAL_MASTER_SPECIFICATION*.md" = "specifications"
    "TECHNICAL_SPECIFICATION*.md" = "specifications"
    
    # Other common patterns
    "CONTRIBUTING*.md" = "root"
    "SECURITY*.md" = "root"
    "CHANGELOG*.md" = "root"
}

# Function to move files with backup
function Move-FileWithBackup {
    param (
        [string]$source,
        [string]$destination
    )
    
    if (Test-Path $destination) {
        $backupPath = "$destination.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Move-Item -Path $destination -Destination $backupPath -Force
        Write-Host "Backed up: $($destination | Split-Path -Leaf) -> $($backupPath | Split-Path -Leaf)" -ForegroundColor Yellow
    }
    
    Move-Item -Path $source -Destination $destination -Force
    Write-Host "Moved: $($source | Split-Path -Leaf) -> docs/$($destination | Split-Path -Parent | Split-Path -Leaf)/" -ForegroundColor Green
}

# Process files in root directory
Get-ChildItem -Path $rootDir -File | ForEach-Object {
    $file = $_
    $fileName = $file.Name
    $filePath = $file.FullName
    
    # Skip files that should stay in root (case-insensitive comparison)
    if ($keepInRoot -contains $fileName.ToLower()) {
        return
    }
    
    # Check if file matches any pattern
    $moved = $false
    foreach ($pattern in $filePatterns.Keys) {
        if ($fileName -like $pattern) {
            $targetDir = Join-Path $docsDir $filePatterns[$pattern]
            $targetPath = Join-Path $targetDir $fileName
            
            # Ensure target directory exists
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            Move-FileWithBackup -source $filePath -destination $targetPath
            $moved = $true
            break
        }
    }
    
    # If file wasn't moved by patterns but is an .md file, move to docs/root
    if (-not $moved -and $file.Extension -eq ".md") {
        $targetDir = Join-Path $docsDir "root"
        $targetPath = Join-Path $targetDir $fileName
        
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        Move-FileWithBackup -source $filePath -destination $targetPath
    }
}

Write-Host "`nRoot directory organization complete!" -ForegroundColor Green
Write-Host "Review the changes and update any references to the moved files." -ForegroundColor Yellow
