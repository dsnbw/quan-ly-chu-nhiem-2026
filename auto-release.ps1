param (
    [string]$Token
)
$Username = "dsnbw"
$RepoName = "quan-ly-chu-nhiem-2026"
$env:GH_TOKEN = $Token

Write-Host "1. Bump version..." -ForegroundColor Cyan
npm version patch --no-git-tag-version
$NewVersion = (Get-Content package.json | ConvertFrom-Json).version

Write-Host "2. Kiem tra va Tao repo tren Github neu chua co..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}
$body = @{
    "name" = $RepoName
    "description" = "Phan mem Quan ly Chu nhiem 2026"
    "private" = $false
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body | Out-Null
} catch {}

Write-Host "3. Dong goi ung dung (Vite & Electron)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Loi build!" -ForegroundColor Red; exit }

Write-Host "4. Dong goi .exe va Publish truc tiep len Github Releases..." -ForegroundColor Cyan
# Tham so -p always (publish always) se tu dong tao Release moi tren Github kem theo file .exe
npx electron-builder --win -p always
if ($LASTEXITCODE -ne 0) { Write-Host "Loi tao Release!" -ForegroundColor Red; exit }

Write-Host "4. Day ma nguon len Github..." -ForegroundColor Cyan
git add .
git commit -m "Auto deploy and release version v$NewVersion"
# Dam bao remote da duoc cau hinh
git remote remove origin 2>$null
git remote add origin "https://${Username}:${Token}@github.com/${Username}/${RepoName}.git"
git branch -M main
git push -u origin main

Write-Host "HOAN TAT XUAT SAC!" -ForegroundColor Green
Write-Host "Phien ban moi nhat da duoc Build, Push code, va tao Release (.exe) tren Github." -ForegroundColor Yellow
Write-Host "Cac may cai dat ung dung nay se tu dong nhan duoc thong bao cap nhat!" -ForegroundColor Green
