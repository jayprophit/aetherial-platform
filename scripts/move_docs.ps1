# Move documentation files to their appropriate directories

# Base paths
$root = $PSScriptRoot
$docs = Join-Path $root "docs"

# Function to safely move files with backup
function Move-DocFile {
    param (
        [string]$pattern,
        [string]$targetDir
    )
    
    $files = Get-ChildItem -Path $root -File -Filter $pattern
    foreach ($file in $files) {
        $target = Join-Path (Join-Path $docs $targetDir) $file.Name
        
        # Create backup if file exists
        if (Test-Path $target) {
            $backup = "$target.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            Move-Item -Path $target -Destination $backup -Force
            Write-Host "Backed up: $target" -ForegroundColor Yellow
        }
        
        # Move the file
        Move-Item -Path $file.FullName -Destination $target -Force
        Write-Host "Moved: $($file.Name) -> docs/$targetDir/" -ForegroundColor Green
    }
}

# Move files by category
# Architecture
Move-DocFile -pattern "*ARCHITECTURE*.md" -targetDir "architecture"
Move-DocFile -pattern "*BLOCKCHAIN_INTEGRATION*.md" -targetDir "architecture"
Move-DocFile -pattern "*AI_ARCHITECTURE*.md" -targetDir "architecture"

# Development
Move-DocFile -pattern "DEVELOPMENT*.md" -targetDir "development"
Move-DocFile -pattern "CODING_STANDARDS*.md" -targetDir "development"
Move-DocFile -pattern "TESTING*.md" -targetDir "development"

# Deployment
Move-DocFile -pattern "DEPLOYMENT*.md" -targetDir "deployment"
Move-DocFile -pattern "PRODUCTION*.md" -targetDir "deployment"
Move-DocFile -pattern "DOCKER*.md" -targetDir "deployment"
Move-DocFile -pattern "KUBERNETES*.md" -targetDir "deployment"

# API
Move-DocFile -pattern "API_*.md" -targetDir "api"
Move-DocFile -pattern "REST_*.md" -targetDir "api"
Move-DocFile -pattern "GRAPHQL_*.md" -targetDir "api"

# Guides & Tutorials
Move-DocFile -pattern "GUIDE*.md" -targetDir "guides"
Move-DocFile -pattern "HOW_TO_*.md" -targetDir "guides"
Move-DocFile -pattern "TUTORIAL*.md" -targetDir "tutorials"
Move-DocFile -pattern "GETTING_STARTED*.md" -targetDir "tutorials"

# Roadmaps & Specifications
Move-DocFile -pattern "ROADMAP*.md" -targetDir "roadmaps"
Move-DocFile -pattern "PLAN*.md" -targetDir "roadmaps"
Move-DocFile -pattern "SPEC*.md" -targetDir "specifications"
Move-DocFile -pattern "REQUIREMENTS*.md" -targetDir "specifications"

# Move remaining .md files to docs/root
Get-ChildItem -Path $root -File -Filter "*.md" | ForEach-Object {
    # Skip files that should stay in root
    $keepInRoot = @("README.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md")
    if ($keepInRoot -contains $_.Name) {
        return
    }
    
    $target = Join-Path (Join-Path $docs "root") $_.Name
    Move-Item -Path $_.FullName -Destination $target -Force
    Write-Host "Moved to docs/root: $($_.Name)" -ForegroundColor Cyan
}

Write-Host "`nDocumentation organization complete!" -ForegroundColor Green
