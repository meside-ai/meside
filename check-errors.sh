#!/bin/sh
cd server && bunx tsc --noEmit && cd ..
cd frontend && bunx tsc --noEmit && cd ..
