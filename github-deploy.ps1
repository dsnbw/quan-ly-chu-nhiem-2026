param (
    [string]$Username,
    [string]$RepoName = "quan-ly-chu-nhiem-2026",
    [string]$Token
)

if (-not $Username -or -not $Token) {
    Write-Host "Vui long nhap Username va Token Github." -ForegroundColor Red
    Write-Host "Cach su dung: .\github-deploy.ps1 -Username <ten> -Token <gh_pat_xxx> -RepoName <ten_repo>" -ForegroundColor Yellow
    exit
}

Write-Host "1. Cap nhat thong tin repo vao Updater.tsx..." -ForegroundColor Cyan
$UpdaterFile = ".\src\components\common\Updater.tsx"
(Get-Content $UpdaterFile) -replace "YOUR_GITHUB_USERNAME/quan-ly-chu-nhiem", "$Username/$RepoName" | Set-Content $UpdaterFile

Write-Host "2. Commit thay doi..." -ForegroundColor Cyan
git add .
git commit -m "Configure auto updater for $Username/$RepoName"

Write-Host "3. Tao Repository moi tren Github..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}
$body = @{
    "name" = $RepoName
    "description" = "Phan mem Quan ly Chu nhiem 2026 - Dong bo Dam may"
    "private" = $false
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body
    Write-Host "Da tao repo $RepoName tren Github." -ForegroundColor Green
} catch {
    Write-Host "Repo co the da ton tai, tiep tuc push..." -ForegroundColor Yellow
}

Write-Host "4. Day ma nguon len Github..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin "https://${Username}:${Token}@github.com/${Username}/${RepoName}.git"
git branch -M main
git push -u origin main

Write-Host "HOAN TAT! Code da duoc day len: https://github.com/${Username}/${RepoName}" -ForegroundColor Green
Write-Host "De chuc nang tu dong cap nhat (Auto-Update) hoat dong, hay tao Release moi tren Github." -ForegroundColor Yellow
