#!/usr/bin/env pwsh
# release.ps1 — Create a GitHub Release from CHANGELOG.md
# Usage: pwsh release.ps1 <version>
# Example: pwsh release.ps1 1.0.9

param (
  [Parameter(Mandatory=$true)]
  [string]$Version
)

$Tag = "v$Version"

# Read CHANGELOG and extract notes for this version
$Changelog = Get-Content "CHANGELOG.md" -Raw
$Pattern = "## v$Version[\s\S]*?(?=\n## v|\n---|$)"
$Match = [regex]::Match($Changelog, $Pattern)
$Notes = ""

if ($Match.Success) {
  $Notes = $Match.Value.Trim()
} else {
  Write-Warning "No entry found in CHANGELOG.md for v$Version"
  # Fallback: use git tag message
  $Notes = "dev-tools v$Version`n`nSee CHANGELOG.md for details."
}

Write-Host "Creating GitHub Release $Tag ..." -ForegroundColor Green

# Create release
gh release create $Tag `
  --repo "MY-Final/dev-tools" `
  --title "v$Version" `
  --notes $Notes `
  --generate-notes

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Release $Tag created successfully!" -ForegroundColor Green
} else {
  Write-Error "❌ Failed to create release"
  exit 1
}
