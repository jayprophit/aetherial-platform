# Aetherial Platform Cleanup Script

# Create required directories
$requiredDirs = @(
    "docs/architecture",
    "docs/development",
    "docs/operations",
    "docs/integrations",
    "docs/analysis",
    "docs/requirements"
)

foreach ($dir in $requiredDirs) {
    $fullPath = Join-Path $PSScriptRoot $dir
    if (-not (Test-Path -Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $fullPath"
    }
}

# Move files from whats_missing_and_needed to their proper locations
$srcDir = Join-Path $PSScriptRoot "whats_missing_and_needed"

if (Test-Path $srcDir) {
    Write-Host "Processing whats_missing_and_needed directory..."
    
    # Move individual files
    $fileMappings = @{
        "PLATFORM_ARCHITECTURE.md" = "docs/architecture/PLATFORM_ARCHITECTURE.md"
        "technical_requirements.md" = "docs/requirements/technical_requirements.md"
        "MANIFEST.md" = "docs/operations/MANIFEST.md"
        "production_analysis.md" = "docs/analysis/production_analysis.md"
    }
    
    foreach ($file in $fileMappings.GetEnumerator()) {
        $source = Join-Path $srcDir $file.Key
        $dest = Join-Path $PSScriptRoot $file.Value
        
        if (Test-Path $source) {
            $destDir = Split-Path -Parent $dest
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            Move-Item -Path $source -Destination $dest -Force
            Write-Host "Moved: $($file.Key) -> $($file.Value)"
        }
    }
    
    # Move directories
    $dirMappings = @{
        "ai_implementation" = "server/ai"
        "ai_testing" = "tests/ai"
        "api-gateway" = "server/api-gateway"
        "auth-service" = "server/auth"
        "blockchain" = "contracts"
        "cross_platform" = "shared"
        "kubernetes" = "k8s"
        "backend" = "server/backend"
        "frontend" = "client"
    }
    
    foreach ($dir in $dirMappings.GetEnumerator()) {
        $source = Join-Path $srcDir $dir.Key
        $dest = Join-Path $PSScriptRoot $dir.Value
        
        if (Test-Path $source) {
            if (Test-Path $dest) {
                # Destination exists, merge contents
                Get-ChildItem -Path $source | ForEach-Object {
                    $itemDest = Join-Path $dest $_.Name
                    if (Test-Path $itemDest) {
                        Remove-Item -Path $itemDest -Recurse -Force
                    }
                    Move-Item -Path $_.FullName -Destination $dest -Force
                }
                Remove-Item -Path $source -Recurse -Force
                Write-Host "Merged contents of $($dir.Key) into $($dir.Value)"
            } else {
                Move-Item -Path $source -Destination $dest -Force
                Write-Host "Moved directory: $($dir.Key) -> $($dir.Value)"
            }
        }
    }
    
    # Handle .github directory specially
    $githubSource = Join-Path $srcDir ".github"
    $githubDest = Join-Path $PSScriptRoot ".github"
    if (Test-Path $githubSource) {
        if (Test-Path $githubDest) {
            # Merge GitHub workflows
            $workflowsSource = Join-Path $githubSource "workflows"
            $workflowsDest = Join-Path $githubDest "workflows"
            if (Test-Path $workflowsSource) {
                if (-not (Test-Path $workflowsDest)) {
                    New-Item -ItemType Directory -Path $workflowsDest -Force | Out-Null
                }
                Get-ChildItem -Path $workflowsSource | ForEach-Object {
                    $destFile = Join-Path $workflowsDest $_.Name
                    if (Test-Path $destFile) {
                        $backupFile = "$destFile.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
                        Move-Item -Path $destFile -Destination $backupFile -Force
                        Write-Host "Backed up existing GitHub workflow: $($_.Name)" -ForegroundColor Yellow
                    }
                    Move-Item -Path $_.FullName -Destination $workflowsDest -Force
                    Write-Host "Moved GitHub workflow: $($_.Name)" -ForegroundColor Green
                }
            }
            Remove-Item -Path $githubSource -Recurse -Force
        } else {
            Move-Item -Path $githubSource -Destination $githubDest -Force
            Write-Host "Moved .github directory to root" -ForegroundColor Green
        }
    }
    
    # Handle remaining files in the root of whats_missing_and_needed
    $remainingFiles = Get-ChildItem -Path $srcDir -File
    foreach ($file in $remainingFiles) {
        $dest = Join-Path $PSScriptRoot $file.Name
        if (Test-Path $dest) {
            $backupFile = "$dest.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            Move-Item -Path $dest -Destination $backupFile -Force
            Write-Host "Backed up existing file: $($file.Name)" -ForegroundColor Yellow
        }
        Move-Item -Path $file.FullName -Destination $PSScriptRoot -Force
        Write-Host "Moved file to root: $($file.Name)" -ForegroundColor Green
    }
    
    # Remove whats_missing_and_needed if empty
    if ((Get-ChildItem -Path $srcDir -Force | Measure-Object).Count -eq 0) {
        Remove-Item -Path $srcDir -Force
        Write-Host "Removed empty directory: whats_missing_and_needed" -ForegroundColor Green
    } else {
        Write-Host "`nWarning: whats_missing_and_needed directory is not empty. Remaining items:" -ForegroundColor Yellow
        Get-ChildItem -Path $srcDir -Recurse | Select-Object FullName | Format-Table -AutoSize
        
        # Create a README in whats_missing_and_needed to explain remaining items
        $readmePath = Join-Path $srcDir "README.md"
        @"
# whats_missing_and_needed

This directory contains files that couldn't be automatically integrated into the main codebase.

## Next Steps
1. Review the files in this directory
2. Integrate them manually if needed
3. Delete this directory once all files have been processed

## Contents
$(Get-ChildItem -Path $srcDir -Recurse | Select-Object FullName | Out-String)
"@ | Out-File -FilePath $readmePath -Force
        
        Write-Host "Created README.md in whats_missing_and_needed with instructions" -ForegroundColor Cyan
    }
}

# Consolidate TODO files
Write-Host "`nConsolidating TODO files..." -ForegroundColor Cyan

$consolidatedTodo = @"
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
$todoPath = Join-Path $PSScriptRoot "TODO.md"
$consolidatedTodo | Out-File -FilePath $todoPath -Force
Write-Host "Created/updated consolidated TODO.md"

# Create a placeholder in whats_missing_and_needed if it doesn't exist
if (-not (Test-Path -Path $srcDir)) {
    New-Item -ItemType Directory -Path $srcDir -Force | Out-Null
    @"
# whats_missing_and_needed

This directory is used for staging new components and features before they are integrated into the main codebase.

## Usage
1. Add new files or features here
2. Update the organization script if needed
3. Run the cleanup script to integrate into the main codebase
"@ | Out-File -FilePath (Join-Path $srcDir "README.md") -Force
    Write-Host "Created placeholder whats_missing_and_needed directory with README"
}

Write-Host "`nRepository cleanup complete!" -ForegroundColor Green
