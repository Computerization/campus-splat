<#
    Method A of docs/training-toolchain.md: install gsplat on the training box.

    This is section 2 ("install") of the doc as one repeatable command, with the two
    traps of that section already handled:

      * the gsplat wheel index and the PyTorch build have to match, otherwise
        pip answers "is not a supported wheel on this platform" - the index is
        translated into a torch version + CUDA index here instead of being
        copied by hand;
      * fused-ssim has no prebuilt Windows wheel; it is only a speedup, so it is
        filtered out of examples/requirements.txt instead of failing the install.

    Nothing on this machine is touched until the first command actually runs:
    add -DryRun to print the whole plan and change nothing.

    Usage:
        powershell -ExecutionPolicy Bypass -File scripts\setup_gsplat.ps1
        powershell -ExecutionPolicy Bypass -File scripts\setup_gsplat.ps1 -DryRun
        powershell -ExecutionPolicy Bypass -File scripts\setup_gsplat.ps1 `
            -EnvDir D:\gsplat-env -RepoDir D:\gsplat -GsplatIndex pt24cu124

    NOTE: keep this file and its output PURE ASCII. Windows PowerShell 5.1 reads
    BOM-less UTF-8 as the system code page, so non-ASCII text here would come out
    mangled (the same reason start-server.cmd stays ASCII).
#>

[CmdletBinding()]
param(
    # Where the dedicated Python environment lives (the doc uses D:\gsplat-env).
    [string]$EnvDir = 'D:\gsplat-env',
    # Where the gsplat repository is cloned (holds examples/simple_trainer.py).
    [string]$RepoDir = 'D:\gsplat',
    # Python version of the environment. 3.10 is the version with prebuilt wheels.
    [string]$Python = '3.10',
    # gsplat's prebuilt wheel index. It fixes the torch version and the CUDA
    # suffix below, which is exactly the combination that has to match.
    [string]$GsplatIndex = 'pt24cu124',
    # Only used when the index above is not one of the known ones.
    [string]$TorchVersion = '',
    [switch]$Force,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# gsplat wheel index -> the PyTorch build its wheels were compiled against.
# https://docs.gsplat.studio/whl/<index>/gsplat/
$KnownIndexes = @{
    'pt24cu124' = @{ Torch = '2.4.1'; Cuda = 'cu124' }
    'pt24cu121' = @{ Torch = '2.4.1'; Cuda = 'cu121' }
    'pt23cu121' = @{ Torch = '2.3.1'; Cuda = 'cu121' }
    'pt23cu118' = @{ Torch = '2.3.1'; Cuda = 'cu118' }
}

function Write-Info { param([string]$Text) Write-Host $Text }
function Write-Step { param([string]$Text) Write-Host ''; Write-Host "==> $Text" -ForegroundColor Cyan }
function Write-Note { param([string]$Text) Write-Host "    $Text" -ForegroundColor DarkGray }
function Write-Warn { param([string]$Text) Write-Host "    [warn] $Text" -ForegroundColor Yellow }

function Require-Tool {
    param([string]$Name, [string]$Hint)
    if (Get-Command $Name -ErrorAction SilentlyContinue) { return }
    if ($DryRun) {
        Write-Warn "'$Name' is not in PATH - the real run would stop here."
        return
    }
    Write-Host ''
    Write-Host "[ERROR] '$Name' was not found in PATH." -ForegroundColor Red
    Write-Host "        $Hint" -ForegroundColor Red
    Write-Host ''
    exit 1
}

# Runs one command, echoing it first so -DryRun is a faithful transcript.
function Invoke-Tool {
    param(
        [Parameter(Mandatory = $true)][string]$Exe,
        [string[]]$Arguments = @(),
        [switch]$AllowFailure
    )
    $line = "$Exe $($Arguments -join ' ')"
    Write-Note $line
    if ($DryRun) { return }
    & $Exe @Arguments
    $code = $LASTEXITCODE
    if ($code -ne 0 -and -not $AllowFailure) {
        throw "command failed (exit $code): $line"
    }
    return $code
}

# ---------------------------------------------------------------- plan

if ($KnownIndexes.ContainsKey($GsplatIndex)) {
    $TorchIndex = $KnownIndexes[$GsplatIndex]
    if (-not $TorchVersion) { $TorchVersion = $TorchIndex.Torch }
    $CudaSuffix = $TorchIndex.Cuda
    if ($TorchVersion -ne $TorchIndex.Torch) {
        Write-Host ''
        Write-Warn "you asked for torch $TorchVersion but the $GsplatIndex wheels were built for torch $($TorchIndex.Torch)."
        Write-Warn 'a mismatching pair is what pip reports as "is not a supported wheel on this platform".'
    }
} else {
    $CudaSuffix = ''
    if (-not $TorchVersion) { $TorchVersion = '2.4.1' }
    Write-Host ''
    Write-Warn "unknown gsplat index '$GsplatIndex' - assuming torch $TorchVersion and cu124."
    Write-Warn 'check https://docs.gsplat.studio/whl/ for the index that matches your torch build.'
}
if (-not $CudaSuffix) { $CudaSuffix = 'cu124' }

$PythonExe = Join-Path $EnvDir 'Scripts\python.exe'
$TorchIndexUrl = "https://download.pytorch.org/whl/$CudaSuffix"
$GsplatIndexUrl = "https://docs.gsplat.studio/whl/$GsplatIndex"

Write-Info 'gsplat (method A of docs/training-toolchain.md)'
Write-Info "  environment : $EnvDir  (python $Python)"
Write-Info "  repository  : $RepoDir"
Write-Info "  torch       : $TorchVersion from $TorchIndexUrl"
Write-Info "  gsplat      : $GsplatIndexUrl"
if ($DryRun) { Write-Host ''; Write-Info 'DRY RUN - nothing will be installed or cloned.' }

Require-Tool -Name 'uv' -Hint 'install it from https://docs.astral.sh/uv/ (Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex")'
Require-Tool -Name 'git' -Hint 'install Git for Windows: https://git-scm.com/download/win'

$nvidia = Get-Command nvidia-smi -ErrorAction SilentlyContinue
if (-not $nvidia) {
    Write-Host ''
    Write-Warn 'nvidia-smi was not found: no NVIDIA driver on this machine (or not in PATH).'
    Write-Warn 'gsplat needs an NVIDIA GPU with compute capability >= 7.0; the install will work, training will not.'
}

# ---------------------------------------------------------------- steps

Write-Step "Create the environment ($EnvDir)"
if ((Test-Path $PythonExe) -and -not $Force) {
    Write-Note "$PythonExe already exists - keeping it (-Force recreates the environment)"
} else {
    if ((Test-Path $EnvDir) -and $Force -and -not $DryRun) {
        Write-Note "removing $EnvDir (-Force)"
        Remove-Item -Recurse -Force $EnvDir
    }
    Invoke-Tool -Exe 'uv' -Arguments @('venv', '--python', $Python, $EnvDir) | Out-Null
}

Write-Step 'Install the CUDA build of PyTorch (must match the gsplat wheel)'
Invoke-Tool -Exe $PythonExe -Arguments @(
    '-m', 'pip', 'install', '--upgrade', 'pip'
) -AllowFailure | Out-Null
Invoke-Tool -Exe $PythonExe -Arguments @(
    '-m', 'pip', 'install', "torch==$TorchVersion", 'torchvision', '--index-url', $TorchIndexUrl
) | Out-Null

Write-Step 'Install gsplat from its prebuilt wheel index (no CUDA compilation)'
Invoke-Tool -Exe $PythonExe -Arguments @(
    '-m', 'pip', 'install', 'ninja', 'numpy', 'jaxtyping', 'rich'
) | Out-Null
Invoke-Tool -Exe $PythonExe -Arguments @(
    '-m', 'pip', 'install', 'gsplat', '--index-url', $GsplatIndexUrl
) | Out-Null

Write-Step "Get the training scripts ($RepoDir)"
$Trainer = Join-Path $RepoDir 'examples\simple_trainer.py'
if (Test-Path $Trainer) {
    Write-Note "$Trainer already exists - keeping it (pull by hand if you want a newer trainer)"
} else {
    Invoke-Tool -Exe 'git' -Arguments @(
        'clone', 'https://github.com/nerfstudio-project/gsplat.git', $RepoDir
    ) | Out-Null
}

Write-Step 'Install the example requirements (without fused-ssim)'
$Requirements = Join-Path $RepoDir 'examples\requirements.txt'
if (Test-Path $Requirements) {
    if ($DryRun) {
        Write-Note "pip install -r $Requirements   # fused-ssim filtered out"
        Write-Note 'skipping fused-ssim: no prebuilt Windows wheel, optional speedup only'
    } else {
        $Filtered = Join-Path ([System.IO.Path]::GetTempPath()) 'gsplat-requirements.txt'
        $kept = Get-Content -LiteralPath $Requirements |
            Where-Object { $_ -notmatch '^\s*fused[-_]ssim' }
        $kept | Set-Content -LiteralPath $Filtered -Encoding ASCII
        if ($kept.Count -lt (Get-Content -LiteralPath $Requirements).Count) {
            Write-Note 'skipping fused-ssim: no prebuilt Windows wheel, optional speedup only'
        }
        Invoke-Tool -Exe $PythonExe -Arguments @(
            '-m', 'pip', 'install', '-r', $Filtered
        ) | Out-Null
        Remove-Item -LiteralPath $Filtered -Force -ErrorAction SilentlyContinue
    }
} else {
    if ($DryRun) {
        Write-Note "after cloning: pip install -r $Requirements   # fused-ssim filtered out"
    } else {
        Write-Warn "$Requirements not found - the trainer may need packages installed by hand."
    }
}

Write-Step 'Check the installation'
# No quotes inside the -c snippet: Windows PowerShell 5.1 mangles nested quotes
# when it hands arguments to a native executable.
Invoke-Tool -Exe $PythonExe -Arguments @(
    '-c',
    'import torch, gsplat; print(gsplat.__version__, torch.cuda.is_available())'
) -AllowFailure | Out-Null

# ---------------------------------------------------------------- result

Write-Step 'Wire it into the platform'
Write-Info 'Put these two lines into .env (repo root), then restart the server:'
Write-Host ''
Write-Host 'THREEDGS_TRAINING_MODE=real'
$Template = "$PythonExe $Trainer default" +
    ' --data_dir {source} --result_dir {model}' +
    ' --max_steps {iterations} --save_steps {iterations} --eval_steps 1000000' +
    ' --ply_steps {iterations} --save_ply --data_factor {data_factor} --disable_viewer'
Write-Host "THREEDGS_GSPLAT_COMMAND=$Template"
Write-Host ''
Write-Info 'Every flag in that template earns its place:'
Write-Info '  --disable_viewer   unattended runs must not wait for a browser viewer'
Write-Info '  --save_ply         gsplat defaults to save_ply=False: without it no .ply is written'
Write-Info '  --ply_steps N      write the point cloud at step N (the 0-indexed name is point_cloud_<N-1>.ply)'
Write-Info '  --data_factor N    image downsampling; the training page controls it via the placeholder'
Write-Info '  --eval_steps 1e6   skip evaluation (no held-out split exists for a single room)'
Write-Host ''
Write-Info 'Then open the admin console -> Training and pick the toolchain "gsplat":'
Write-Info 'both the toolchain choice and the command template are checked there.'
