# 🔍 Firefox MetaMask Connection Diagnosis

## Current Status

**Issue**: ConnectButton shows wallet list, but clicking MetaMask doesn't trigger connection in Firefox.

**Console Observations**:
- ✅ Client ID loaded correctly
- ✅ No domain/CORS errors
- ⚠️ No debug logs appearing (might be filtered)
- ⚠️ No connection errors visible

## Potential Causes

### 1. **Firefox Popup Blocker**
Firefox may be blocking MetaMask popup window.

**Solution**: 
- Check Firefox popup blocker settings
- Allow popups for `localhost:3000`
- Firefox Settings → Privacy & Security → Permissions → Pop-ups → Allow for localhost

### 2. **MetaMask Detection in Firefox**
Firefox may structure `window.ethereum` differently.

**Check**: Open browser console and run:
```javascript
console.log(window.ethereum)
console.log(window.ethereum?.isMetaMask)
console.log(window.ethereum?.providers)
```

### 3. **Thirdweb ConnectButton Firefox Issue**
ConnectButton might not properly trigger MetaMask in Firefox.

**Solution**: Use manual connection button (already added)

### 4. **Dialog Z-Index Conflict**
Our Dialog might be blocking ConnectButton's modal.

**Status**: Already handled with `onInteractOutside` fix

## Solutions Implemented

### ✅ Manual MetaMask Connection Button
Added a "Connect MetaMask Directly" button that bypasses ConnectButton and connects directly.

**How to use**:
1. Click "Connect MetaMask Directly (Firefox Fix)" button
2. This will trigger MetaMask connection manually
3. Approve in MetaMask popup

### ✅ Enhanced Debug Logging
Added comprehensive logging to track:
- Dialog open state
- MetaMask detection
- Connection events
- Error messages

## Testing Steps

1. **Check MetaMask Detection**:
   - Open browser console (F12)
   - Look for: `✅ window.ethereum detected`
   - Look for: `✅ Is MetaMask: true`

2. **Try Manual Connection**:
   - Click "Connect MetaMask Directly (Firefox Fix)" button
   - Watch console for connection logs
   - Check if MetaMask popup opens

3. **Check Popup Blocker**:
   - Firefox menu → Settings → Privacy & Security
   - Scroll to "Permissions"
   - Click "Settings" next to "Pop-ups and Redirects"
   - Ensure localhost is allowed

4. **Verify MetaMask is Unlocked**:
   - Click MetaMask extension icon
   - Ensure wallet is unlocked
   - Check if any pending connection requests exist

## Next Steps

If manual connection works but ConnectButton doesn't:
- This confirms Firefox-specific ConnectButton issue
- We can use manual connection as primary method
- Or investigate thirdweb ConnectButton Firefox compatibility

If manual connection also fails:
- Check MetaMask extension status
- Verify window.ethereum is available
- Check for Firefox-specific errors in console


