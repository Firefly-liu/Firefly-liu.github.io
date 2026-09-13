# ============================================================
#  firefly_liu的小家 · 背景图批量压缩工具
#  用途：把大图（手机拍的、画师原图）压成适合网页的尺寸
#  用法：右键「使用 PowerShell 运行」，或在本目录执行
#        pwsh -File .\optimize-images.ps1
#  说明：脚本只读取 SOURCE_DIR 里的图，输出到站点 images 下，
#        不会修改你的原始图片。
# ============================================================

Add-Type -AssemblyName System.Drawing

# ---------- 可修改：源图目录 ----------
$SOURCE_DIR = "D:\图片\流萤"

# ---------- 可修改：图片清单 ----------
# 电脑端横屏背景（会压到 1920 宽）
$desktop = @(
  @{ src = "1718469392860.jpg";                                       out = "images\desktop\d-8.jpg"  },
  @{ src = "1718674616502650b86047bbbd2c8c7cb9f232f88418a8bdb909444af3270f58b42d3d3144c81.0.jpg"; out = "images\desktop\d-9.jpg"  },
  @{ src = "121605678_p0.jpg";                                        out = "images\desktop\d-10.jpg" },
  @{ src = "Image_1717937896707.jpg";                                 out = "images\desktop\d-11.jpg" },
  @{ src = "17208251007569cc9769c44fdee59d1d34074089bef0462c30392988594ae63ec03c9c5f143fb.0.jpg"; out = "images\desktop\d-12.jpg" },
  @{ src = "171937887295063c71f4d39133a3f0909cfd7db230a4825e0afdadd83592a9c25f6be752e835f.0.jpg"; out = "images\desktop\d-13.jpg" },
  @{ src = "128469761_p0.png";                                        out = "images\desktop\d-14.jpg" },
  @{ src = "IMG_20240725_152833.jpg";                                 out = "images\desktop\d-15.jpg" }
)

# 手机端竖屏背景（会压到 1080 宽）
$mobile = @(
  @{ src = "138727303_p0.png";  out = "images\mobile\m-14.jpg" },
  @{ src = "121391175_p0.jpg";  out = "images\mobile\m-15.jpg" },
  @{ src = "123707785_p0.jpg";  out = "images\mobile\m-16.jpg" },
  @{ src = "123393901_p0.jpg";  out = "images\mobile\m-17.jpg" },
  @{ src = "124058650_p0.jpg";  out = "images\mobile\m-18.jpg" }
)

# 装饰用透明 PNG（保留透明通道，压到指定高度以内）
$deco = @(
  @{ src = "流萤-1.png";       out = "images\deco\firefly-stand.png"  ; width = 0; height = 760 },
  @{ src = "ホタル2+1-1.png";  out = "images\deco\firefly-bubble.png" ; width = 0; height = 700 }
)

# 表情包（压到 260 宽，用于自我介绍页）
$emote = @(
  @{ src = "表情包\待机.jpg";   out = "images\emote\idle.jpg"  },
  @{ src = "表情包\聆听.png";   out = "images\emote\listen.jpg" },
  @{ src = "表情包\说话.jpg";   out = "images\emote\talk.jpg"  },
  @{ src = "表情包\思考？.jpg"; out = "images\emote\think.jpg" },
  @{ src = "表情包\good.jpg";   out = "images\emote\good.jpg"  },
  @{ src = "表情包\撒娇.jpg";   out = "images\emote\cute.jpg"  }
)

# ---------- 以下不用改 ----------

$siteRoot = Split-Path -Parent $PSScriptRoot

function Resize-Image {
    param(
        [string]$SrcFile,
        [string]$OutFile,
        [int]$MaxWidth,
        [int]$MaxHeight,
        [int]$Quality = 82,
        [bool]$KeepAlpha = $false
    )

    $src = [System.Drawing.Image]::FromFile($SrcFile)
    try {
        $ratio = 1.0
        if ($MaxWidth -gt 0  -and $src.Width  -gt $MaxWidth)  { $ratio = [Math]::Min($ratio, $MaxWidth / $src.Width) }
        if ($MaxHeight -gt 0 -and $src.Height -gt $MaxHeight) { $ratio = [Math]::Min($ratio, $MaxHeight / $src.Height) }

        $w = [int][Math]::Round($src.Width * $ratio)
        $h = [int][Math]::Round($src.Height * $ratio)

        $bmp = New-Object System.Drawing.Bitmap $w, $h
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        if ($KeepAlpha) { $g.Clear([System.Drawing.Color]::Transparent) }
        $g.DrawImage($src, 0, 0, $w, $h)
        $g.Dispose()

        $full = Join-Path $siteRoot $OutFile
        $dir = Split-Path -Parent $full
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        if (Test-Path $full) { Remove-Item $full -Force }

        if ($KeepAlpha) {
            $bmp.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
        } else {
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
                     Where-Object { $_.MimeType -eq 'image/jpeg' }
            $ps = New-Object System.Drawing.Imaging.EncoderParameters 1
            $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
            $bmp.Save($full, $codec, $ps)
        }
        $bmp.Dispose()

        $before = [Math]::Round((Get-Item $SrcFile).Length / 1KB)
        $after  = [Math]::Round((Get-Item $full).Length / 1KB)
        Write-Host ("  OK  {0}  ->  {1}   {2}KB => {3}KB" -f `
            [System.IO.Path]::GetFileName($SrcFile), $OutFile, $before, $after)
    }
    finally {
        $src.Dispose()
    }
}

function Run-List {
    param([string]$Label, [array]$List, [int]$MaxWidth, [int]$MaxHeight, [bool]$KeepAlpha)
    Write-Host ""
    Write-Host "== $Label ==" -ForegroundColor Cyan
    foreach ($item in $List) {
        $srcFile = Join-Path $SOURCE_DIR $item.src
        if (-not (Test-Path $srcFile)) { Write-Host "  跳过（找不到）：$($item.src)" -ForegroundColor Yellow; continue }
        $mw = if ($item.width)  { $item.width }  else { $MaxWidth }
        $mh = if ($item.height) { $item.height } else { $MaxHeight }
        try { Resize-Image -SrcFile $srcFile -OutFile $item.out -MaxWidth $mw -MaxHeight $mh -KeepAlpha $KeepAlpha }
        catch { Write-Host "  失败：$($item.src) => $($_.Exception.Message)" -ForegroundColor Red }
    }
}

Write-Host "站点目录：$siteRoot"
Run-List -Label "电脑端背景" -List $desktop -MaxWidth 1920 -MaxHeight 0     -KeepAlpha $false
Run-List -Label "手机端背景" -List $mobile  -MaxWidth 1080 -MaxHeight 0     -KeepAlpha $false
Run-List -Label "透明装饰图" -List $deco    -MaxWidth 0    -MaxHeight 1200  -KeepAlpha $true
Run-List -Label "表情包"     -List $emote   -MaxWidth 260  -MaxHeight 0     -KeepAlpha $false

Write-Host ""
Write-Host "全部完成。" -ForegroundColor Green
