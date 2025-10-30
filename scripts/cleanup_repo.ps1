<#
.SYNOPSIS
    Aetherial Platform - Repository Cleanup Script

.DESCRIPTION
    This script cleans up the repository by:
    1. Moving all files from whats_missing_and_needed to their correct locations
    2. Organizing the TODO files
    3. Removing any temporary or unnecessary files
    4. Ensuring proper directory structure
#>

# Set error action preference
$ErrorActionPreference = "Stop"

# Base directories
$RootDir = Split-Path -Parent $PSScriptRoot
$SrcDir = Join-Path $RootDir "whats_missing_and_needed"

# Create required directories if they don't exist
$requiredDirs = @(
    "docs/architecture",
    "docs/development",
    "docs/operations",
    "docs/integrations",
    "docs/analysis",
    "docs/requirements",
    "server/ai",
    "server/api-gateway",
    "server/auth",
    "tests/ai",
    "tests/dapp",
    "monitoring",
    "build/artifacts"
)

foreach ($dir in $requiredDirs) {
    $fullPath = Join-Path $RootDir $dir
    if (-not (Test-Path -Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $fullPath"
    }
}

# Function to safely move files
function Move-FileWithBackup {
    param (
        [string]$Source,
        [string]$Destination
    )
    
    if (-not (Test-Path -Path $Source)) {
        Write-Warning "Source not found: $Source"
        return
    }
    
    $destPath = Join-Path $RootDir $Destination
    $destDir = Split-Path -Parent $destPath
    
    # Ensure destination directory exists
    if (-not (Test-Path -Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    # If destination exists, create a backup
    if (Test-Path -Path $destPath) {
        $backupPath = "$destPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Write-Host "Backing up existing file to: $backupPath"
        Move-Item -Path $destPath -Destination $backupPath -Force
    }
    
    # Move the file
    Move-Item -Path $Source -Destination $destPath -Force
    Write-Host "Moved: $Source -> $destPath"
}

# Clean up whats_missing_and_needed directory
if (Test-Path -Path $SrcDir) {
    Write-Host "`nProcessing whats_missing_and_needed directory..." -ForegroundColor Cyan
    
    # Move all files and directories to their proper locations
    $items = Get-ChildItem -Path $SrcDir -File
    foreach ($item in $items) {
        $dest = switch -Wildcard ($item.Name) {
            "BLT_IMPLEMENTATION_PLAN.md" { "docs/development/BLT_IMPLEMENTATION_PLAN.md" }
            "MANIFEST.md" { "docs/operations/MANIFEST.md" }
            "MANUS_INTEGRATION.md" { "docs/integrations/MANUS_INTEGRATION.md" }
            "PLATFORM_ARCHITECTURE.md" { "docs/architecture/PLATFORM_ARCHITECTURE.md" }
            "production_analysis.md" { "docs/analysis/production_analysis.md" }
            "technical_requirements.md" { "docs/requirements/technical_requirements.md" }
            "deploy.sh" { "scripts/deploy.sh" }
            default { $null }
        }
        
        if ($dest) {
            Move-FileWithBackup -Source $item.FullName -Destination $dest
        }
    }
    
    # Move all directories
    $dirs = Get-ChildItem -Path $SrcDir -Directory
    foreach ($dir in $dirs) {
        $dest = switch ($dir.Name) {
            "ai_implementation" { "server/ai" }
            "ai_testing" { "tests/ai" }
            "api-gateway" { "server/api-gateway" }
            "auth-service" { "server/auth" }
            "blockchain" { "contracts" }
            "cross_platform" { "shared" }
            "dapp_testing" { "tests/dapp" }
            "kubernetes" { "k8s" }
            "low_precision_training" { "server/ai/training/low_precision" }
            "monitoring" { "monitoring" }
            "robotics" { "server/robotics" }
            "windsurf_artifacts" { "build/artifacts" }
            default { $null }
        }
        
        if ($dest) {
            $fullDest = Join-Path $RootDir $dest
            if (Test-Path -Path $fullDest) {
                # If destination exists, merge the directories
                Write-Host "Merging directory: $($dir.Name) -> $dest"
                Get-ChildItem -Path $dir.FullName | ForEach-Object {
                    $destPath = Join-Path $fullDest $_.Name
                    if (Test-Path -Path $destPath) {
                        Remove-Item -Path $destPath -Recurse -Force
                    }
                    Move-Item -Path $_.FullName -Destination $fullDest -Force
                }
                Remove-Item -Path $dir.FullName -Recurse -Force
            } else {
                Move-Item -Path $dir.FullName -Destination $fullDest -Force
                Write-Host "Moved directory: $($dir.Name) -> $dest"
            }
        }
    }
    
    # Remove empty whats_missing_and_needed directory if it exists
    if ((Get-ChildItem -Path $SrcDir -Force | Measure-Object).Count -eq 0) {
        Remove-Item -Path $SrcDir -Force
        Write-Host "Removed empty directory: $SrcDir"
    } else {
        Write-Host "`nWarning: whats_missing_and_needed directory is not empty. Remaining items:" -ForegroundColor Yellow
        Get-ChildItem -Path $SrcDir -Recurse | Select-Object FullName | Format-Table -AutoSize
    }
}

# Clean up TODO files
Write-Host "`nOrganizing TODO files..." -ForegroundColor Cyan

# Consolidate TODO files
$mainTodo = @"
# Aetherial Platform - Consolidated TODO

## Core Platform
- [ ] Complete authentication system (login, signup, OAuth providers)
- [ ] Build admin dashboard (WordPress/BuddyBoss-style)
- [ ] Create base UI layout with sidebar navigation (BuddyBoss-inspired)
- [ ] Implement main navigation system
- [ ] Set up routing for all modules

## AI/ML Integration
- [ ] Update all AI models to latest versions (GPT-4o, Claude 4.5, etc.)
- [ ] Implement AI service integrations
- [ ] Set up model version management
- [ ] Add AI monitoring and analytics

## Infrastructure
- [ ] Complete Kubernetes setup for production
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipelines
- [ ] Implement backup and recovery

## Testing
- [ ] Write unit tests for core functionality
- [ ] Implement integration tests
- [ ] Set up end-to-end testing
- [ ] Configure test coverage reporting

## Documentation
- [ ] Update API documentation
- [ ] Write user guides
- [ ] Create developer documentation
- [ ] Document deployment procedures

## Security
- [ ] Implement security best practices
- [ ] Set up authentication and authorization
- [ ] Configure rate limiting and DDoS protection
- [ ] Perform security audit

## Performance
- [ ] Optimize database queries
- [ ] Implement caching
- [ ] Optimize frontend performance
- [ ] Set up performance monitoring
"@

# Save consolidated TODO
$mainTodoPath = Join-Path $RootDir "TODO.md"
$mainTodo | Out-File -FilePath $mainTodoPath -Force
Write-Host "Created/updated consolidated TODO.md"

# Create a placeholder in whats_missing_and_needed if it doesn't exist
if (-not (Test-Path -Path $SrcDir)) {
    New-Item -ItemType Directory -Path $SrcDir -Force | Out-Null
    "# whats_missing_and_needed`n`nThis directory is used for staging new components and features before they are integrated into the main codebase.`n`n## Usage`n1. Add new files or features here`n2. Update the organization script if needed`n3. Run the cleanup script to integrate into the main codebase`n" | Out-File -FilePath (Join-Path $SrcDir "README.md") -Force
    Write-Host "Created placeholder whats_missing_and_needed directory with README"
}

Write-Host "`nRepository cleanup complete!" -ForegroundColor Green
