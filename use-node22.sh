#!/bin/bash
# This script sets up the environment to use Node.js 22 via fnm
eval "$(fnm env)"
fnm use 22
exec "$@"
