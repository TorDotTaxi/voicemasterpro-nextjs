# 🚨 SECURITY BREACH - Git History Cleanup Required

## Critical Issue

**Real API keys were committed to git history** in the following commits:
- Commit: `77a8a55be7c9069a4c903f460a8c232f0a73b594`
- File: `add-vercel-env.bat`
- Contains: 4 real API keys in plain text

## Immediate Actions Required

### 1. ✅ ROTATE ALL API KEYS (Do this FIRST!)

Go to each provider and revoke/regenerate these keys:

- [ ] **Gemini API** - https://makersuite.google.com/app/apikey
- [ ] **Deepgram** - https://console.deepgram.com/
- [ ] **FPT AI** - https://fpt.ai/
- [ ] **AssemblyAI** - https://www.assemblyai.com/

⚠️ **Do NOT skip this step!** Even after cleaning git history, assume these keys are compromised.

### 2. Clean Git History

#### Option A: If NOT yet pushed to remote

```powershell
# Check if pushed
git log origin/main..HEAD

# If there are unpushed commits, you can reset
git reset --hard <commit-before-77a8a55>

# Or interactively rebase to remove the bad commit
git rebase -i HEAD~5  # Adjust number as needed
```

#### Option B: If ALREADY pushed to remote (GitHub)

You MUST rewrite history and force-push:

```powershell
# Install git-filter-repo (recommended method)
pip install git-filter-repo

# Remove the file from ALL history
git filter-repo --invert-paths --path add-vercel-env.bat

# Force push to remote
git push --force-with-lease

# WARNING: This will rewrite history!
# Anyone who has cloned must re-clone or reset their local copy
```

#### Alternative: Using BFG Repo Cleaner

```powershell
# Download BFG from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove the file from history
java -jar bfg.jar --delete-files add-vercel-env.bat

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

### 3. Verify Cleanup

After cleaning:

```powershell
# Search for any remaining API keys
git log --all --full-history -S'AIzaSyBxuMbv' --source --

# Should return NO results
```

### 4. Update .env.local with NEW keys

```powershell
# Edit .env.local with rotated keys
notepad .env.local
```

## Prevention Measures

### What we've already done:
- ✅ Added `add-vercel-env.bat` to `.gitignore`
- ✅ Removed placeholder API keys from documentation
- ✅ Deleted dangerous files from working directory

### What you must do:
- [ ] Rotate all 4 API keys
- [ ] Clean git history (if pushed)
- [ ] Update `.env.local` with new keys
- [ ] Add new keys to Vercel Dashboard
- [ ] Never commit files with real secrets again

## Lessons Learned

1. **NEVER** hardcode API keys in any committed file
2. **ALWAYS** use `.env.local` for sensitive data (gitignored)
3. **VERIFY** what's being committed before pushing
4. **USE** environment variable placeholders in documentation
5. **ROTATE** keys immediately if exposed

## Next Steps

1. [ ] Rotate all 4 API keys (URGENT!)
2. [ ] Clean git history using one of the methods above
3. [ ] Update .env.local with NEW keys
4. [ ] Add NEW keys to Vercel Dashboard
5. [ ] Deploy with new credentials

## Support Resources

- Git filter-repo docs: https://github.com/newren/git-filter-repo
- BFG Repo Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
- GitHub secret scanning: https://docs.github.com/en/code-security/secret-scanning

---

**Status**: ⚠️ URGENT - Keys exposed in git history - immediate action required

