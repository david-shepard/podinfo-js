#!/bin/bash
# Configured for macOS, but should work on Linux as well

ACT_GH_TOKEN="$(gh auth token)" &> /dev/null || "$GITHUB_TOKEN"
BUILD_FILE="${1:-.github/workflows/ci-build-push.yml}"
GH_ARGS=(
    -W $BUILD_FILE
    -s GITHUB_TOKEN="$ACT_GH_TOKEN"
    --container-options "--add-host=host.docker.internal:host-gateway"
)
if command -v act &> /dev/null; then
    # Commented out to avoid exposing secrets
    echo "Running: act ${GH_ARGS[*]}"
    act "${GH_ARGS[@]}"
else
    echo "'act' Command does not exist, trying gh act ${GH_ARGS[*]}"
    gh act "${GH_ARGS[@]}"
fi