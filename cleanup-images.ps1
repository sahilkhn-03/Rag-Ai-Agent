<#
cleanup-images.ps1

Safe cleanup script for GCR images used by the rag-ai-backend service.

Usage (dry-run):
  .\cleanup-images.ps1

To actually delete candidates after review:
  .\cleanup-images.ps1 -Delete

Make sure you're authenticated with gcloud and the correct project is selected.
#>

param(
    [switch]$Delete = $false,
    [string]$Project = "brilliant-flame-475104-c2",
    [string]$Region = "asia-south1",
    [string]$Service = "rag-ai-backend",
    [string]$Repo = ""
)

if (-not $Repo) {
    $Repo = "gcr.io/$Project/$Service"
}

Write-Host "Project: $Project"
Write-Host "Repo: $Repo"
Write-Host "Service: $Service (region $Region)"
Write-Host "Dry-run mode: $(!$Delete)"

# Get deployed image (may include tag or digest)
$deployedImage = gcloud run services describe $Service --region $Region --project $Project --format="value(spec.template.spec.containers[0].image)" 2>$null
if (-not $deployedImage) {
    Write-Error "Could not read deployed image for service $Service. Make sure gcloud is logged in and project is set."
    exit 1
}

Write-Host "Deployed image: $deployedImage"

# Extract digest if present
$deployedDigest = $null
if ($deployedImage -match "@sha256:([0-9a-fA-F]+)$") {
    $deployedDigest = $Matches[1]
    Write-Host "Deployed digest: $deployedDigest"
}
else {
    Write-Warning "No digest found in deployed image (may be using tag). The script will try to avoid deleting images with tags matching the deployed image."
}

# List all tags/digests as JSON
$jsonText = gcloud container images list-tags $Repo --format="json" 2>$null
if (-not $jsonText) {
    Write-Host "No tags found for $Repo or command failed."
    exit 0
}

$json = $null
try {
    $json = $jsonText | ConvertFrom-Json
}
catch {
    Write-Error "Failed to parse image list JSON: $_"
    exit 1
}

$candidates = @()
foreach ($item in $json) {
    $digest = $item.digest
    $tags = if ($item.tags) { $item.tags -join "," } else { "<no-tags>" }
    $time = $item.uploaded.time

    # Skip the deployed digest
    if ($deployedDigest -and $digest -eq $deployedDigest) {
        Write-Host "KEEP (deployed): $digest  tags:$tags  uploaded:$time"
        continue
    }

    # Optionally skip images with tags you want to preserve (e.g., 'latest' or 'prod')
    # if ($item.tags -and ($item.tags -contains 'latest' -or $item.tags -contains 'prod')) { Write-Host "KEEP (tagged): $digest"; continue }

    $candidates += [PSCustomObject]@{ digest = $digest; tags = $tags; uploaded = $time }
}

Write-Host "`nFound $($candidates.Count) candidate(s) for deletion:`n"
$candidates | Format-Table -AutoSize

if ($Delete) {
    foreach ($c in $candidates) {
        $full = "$Repo@$($c.digest)"
        Write-Host "Deleting $full ..."
        gcloud container images delete $full --project $Project --quiet
    }
    Write-Host "Deletion complete."
}
else {
    Write-Host "`nDry-run complete. To actually delete the above candidates, re-run with -Delete switch:`n  .\cleanup-images.ps1 -Delete"
}
