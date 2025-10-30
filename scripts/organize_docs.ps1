# Script to organize documentation and other files from root to appropriate directories

# Base directories
$rootDir = $PSScriptRoot
$docsDir = Join-Path $rootDir "docs"

# Create documentation subdirectories if they don't exist
$docCategories = @(
    "architecture",
    "development",
    "deployment",
    "api",
    "guides",
    "tutorials",
    "roadmaps",
    "specifications"
)

foreach ($dir in $docCategories) {
    $fullPath = Join-Path $docsDir $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

# Define file patterns and their target directories
$fileMappings = @{
    # Architecture
    "ARCHITECTURE*.md" = "architecture"
    "AETHERIAL_AI_ARCHITECTURE*.md" = "architecture"
    "AI_ARCHITECTURE*.md" = "architecture"
    "BLOCKCHAIN_INTEGRATION*.md" = "architecture"
    "PLATFORM_ARCHITECTURE*.md" = "architecture"
    
    # Development
    "DEVELOPMENT*.md" = "development"
    "IMPLEMENTATION*.md" = "development"
    "CODING_STANDARDS*.md" = "development"
    "TESTING*.md" = "development"
    "DEBUGGING*.md" = "development"
    
    # Deployment
    "DEPLOYMENT*.md" = "deployment"
    "PRODUCTION*.md" = "deployment"
    "DOCKER*.md" = "deployment"
    "KUBERNETES*.md" = "deployment"
    "CI_CD*.md" = "deployment"
    
    # API
    "API_*.md" = "api"
    "REST_*.md" = "api"
    "GRAPHQL_*.md" = "api"
    "SWAGGER*.md" = "api"
    "OPENAPI*.md" = "api"
    
    # Guides
    "GUIDE*.md" = "guides"
    "HOW_TO_*.md" = "guides"
    "TUTORIAL*.md" = "tutorials"
    "GETTING_STARTED*.md" = "tutorials"
    
    # Roadmaps
    "ROADMAP*.md" = "roadmaps"
    "PLAN*.md" = "roadmaps"
    "TIMELINE*.md" = "roadmaps"
    
    # Specifications
    "SPEC*.md" = "specifications"
    "REQUIREMENTS*.md" = "specifications"
    "AETHERIAL_MASTER_SPECIFICATION*.md" = "specifications"
}

# Files that should stay in the root
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
    ".editorconfig"
)

# Process files in the root directory
Get-ChildItem -Path $rootDir -File | ForEach-Object {
    $file = $_
    $moved = $false
    
    # Skip files that should stay in root
    if ($keepInRoot -contains $file.Name) {
        return
    }
    
    # Check if file matches any pattern
    foreach ($pattern in $fileMappings.Keys) {
        if ($file.Name -like $pattern) {
            $targetDir = Join-Path $docsDir $fileMappings[$pattern]
            $targetPath = Join-Path $targetDir $file.Name
            
            # Create backup if file exists
            if (Test-Path $targetPath) {
                $backupPath = "$targetPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
                Move-Item -Path $targetPath -Destination $backupPath -Force
                Write-Host "Backed up existing file: $($file.Name) -> $backupPath" -ForegroundColor Yellow
            }
            
            # Move the file
            Move-Item -Path $file.FullName -Destination $targetPath -Force
            Write-Host "Moved: $($file.Name) -> $targetPath" -ForegroundColor Green
            $moved = $true
            break
        }
    }
    
    # If file wasn't moved by the patterns but is an .md file, move to docs/root
    if (-not $moved -and $file.Extension -eq ".md") {
        $targetDir = Join-Path $docsDir "root"
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        $targetPath = Join-Path $targetDir $file.Name
        
        if (Test-Path $targetPath) {
            $backupPath = "$targetPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            Move-Item -Path $targetPath -Destination $backupPath -Force
            Write-Host "Backed up existing file: $($file.Name) -> $backupPath" -ForegroundColor Yellow
        }
        
        Move-Item -Path $file.FullName -Destination $targetPath -Force
        Write-Host "Moved to docs/root: $($file.Name)" -ForegroundColor Cyan
    }
}

# Create or update README.md with new documentation structure
$newReadme = @"
# Aetherial Platform

## Documentation Structure

Documentation has been reorganized into the following categories:

- **/docs/architecture** - System architecture and design documents
- **/docs/development** - Development guides and standards
- **/docs/deployment** - Deployment and operations
- **/docs/api** - API documentation
- **/docs/guides** - How-to guides
- **/docs/tutorials** - Step-by-step tutorials
- **/docs/roadmaps** - Project roadmaps and plans
- **/docs/specifications** - Technical specifications
- **/docs/root** - Other documentation files

## Quick Links

- [Getting Started](/docs/tutorials/GETTING_STARTED.md)
- [API Documentation](/docs/api/README.md)
- [Development Guide](/docs/development/DEVELOPMENT_GUIDE.md)
- [Deployment Guide](/docs/deployment/DEPLOYMENT_GUIDE.md)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the terms of the [MIT License](LICENSE).
"@

$readmePath = Join-Path $rootDir "README.md"
if (-not (Test-Path $readmePath)) {
    $newReadme | Out-File -FilePath $readmePath -Force
    Write-Host "Created new README.md" -ForegroundColor Green
} else {
    $backupPath = "$readmePath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Move-Item -Path $readmePath -Destination $backupPath -Force
    $newReadme | Out-File -FilePath $readmePath -Force
    Write-Host "Updated README.md (backup created at $backupPath)" -ForegroundColor Green
}

Write-Host "`nDocumentation organization complete!" -ForegroundColor Green
Write-Host "Please review the changes and update any links in the codebase that reference the moved files." -ForegroundColor Yellow
