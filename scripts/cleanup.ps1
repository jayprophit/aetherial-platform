<#
.SYNOPSIS
    Aetherial Platform - Cleanup Script for whats_missing_and_needed

.DESCRIPTION
    This script moves all remaining files from whats_missing_and_needed to their
    correct locations in the project structure.
#>

# Base directories
$RootDir = Split-Path -Parent $PSScriptRoot
$SrcDir = Join-Path $RootDir "whats_missing_and_needed"

# Mapping of source to destination paths
$Mappings = @{
    "BLT_IMPLEMENTATION_PLAN.md" = "docs\development\BLT_IMPLEMENTATION_PLAN.md"
    "MANIFEST.md" = "docs\operations\MANIFEST.md"
    "MANUS_INTEGRATION.md" = "docs\integrations\MANUS_INTEGRATION.md"
    "PLATFORM_ARCHITECTURE.md" = "docs\architecture\PLATFORM_ARCHITECTURE.md"
    "production_analysis.md" = "docs\analysis\production_analysis.md"
    "technical_requirements.md" = "docs\requirements\technical_requirements.md"
    "deploy.sh" = "scripts\deploy.sh"
    "ai_implementation" = "server\ai"
    "ai_testing" = "tests\ai"
    "api-gateway" = "server\api-gateway"
    "auth-service" = "server\auth"
    "blockchain" = "contracts"
    "cross_platform" = "shared"
    "dapp_testing" = "tests\dapp"
    "kubernetes" = "k8s"
    "low_precision_training" = "server\ai\training\low_precision"
    "monitoring" = "monitoring"
    "robotics" = "server\robotics"
    "windsurf_artifacts" = "build\artifacts"
}

# Create directory if it doesn't exist
function Ensure-Directory {
    param ([string]$Path)
    
    if (-not (Test-Path -Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "Created directory: $Path"
    }
}

# Move item from source to destination
function Move-ItemWithMerge {
    param (
        [string]$Source,
        [string]$Destination
    )
    
    if (-not (Test-Path -Path $Source)) {
        Write-Warning "Source not found: $Source"
        return
    }
    
    $sourceItem = Get-Item $Source
    $destPath = Join-Path $RootDir $Destination
    
    # Ensure parent directory exists
    Ensure-Directory -Path (Split-Path -Path $destPath -Parent)
    
    if (Test-Path -Path $destPath) {
        if ((Get-Item $destPath) -is [System.IO.DirectoryInfo] -and $sourceItem -is [System.IO.DirectoryInfo]) {
            # Merge directories
            Get-ChildItem -Path $Source | ForEach-Object {
                $itemDest = Join-Path $destPath $_.Name
                if (Test-Path -Path $itemDest) {
                    Remove-Item -Path $itemDest -Recurse -Force
                }
                Move-Item -Path $_.FullName -Destination $destPath -Force
            }
            Write-Host "Merged directory: $Source -> $destPath"
        } else {
            # Remove existing file/directory
            Remove-Item -Path $destPath -Recurse -Force
            Move-Item -Path $Source -Destination $destPath -Force
            Write-Host "Moved: $Source -> $destPath"
        }
    } else {
        Move-Item -Path $Source -Destination $destPath -Force
        Write-Host "Moved: $Source -> $destPath"
    }
}

# Main script
Write-Host "Starting cleanup of whats_missing_and_needed..." -ForegroundColor Cyan
Write-Host "=============================================="

# Process all items in the mapping
$Mappings.GetEnumerator() | ForEach-Object {
    $srcPath = Join-Path $SrcDir $_.Key
    $destRel = $_.Value
    
    Write-Host "`nProcessing: $($_.Key) -> $destRel"
    Move-ItemWithMerge -Source $srcPath -Destination $destRel
}

# Remove empty directories in whats_missing_and_needed
Write-Host "`nCleaning up empty directories..."
Get-ChildItem -Path $SrcDir -Directory -Recurse | 
    Where-Object { $_.GetFiles().Count -eq 0 -and $_.GetDirectories().Count -eq 0 } |
    ForEach-Object {
        Write-Host "Removing empty directory: $($_.FullName)"
        Remove-Item -Path $_.FullName -Force
    }

# Remove whats_missing_and_needed if empty
if ((Get-ChildItem -Path $SrcDir -Force | Measure-Object).Count -eq 0) {
    Write-Host "`nRemoving empty directory: $SrcDir"
    Remove-Item -Path $SrcDir -Force
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "============================================="

# Verify the directory is empty
if (Test-Path -Path $SrcDir) {
    $remainingItems = Get-ChildItem -Path $SrcDir -Recurse -Force
    if ($remainingItems) {
        Write-Host "`nWarning: Some items were not moved:" -ForegroundColor Yellow
        $remainingItems | ForEach-Object { Write-Host "- $($_.FullName)" }
    } else {
        Write-Host "All items have been successfully moved and organized." -ForegroundColor Green
    }
} else {
    Write-Host "The whats_missing_and_needed directory has been completely cleaned up." -ForegroundColor Green
}
