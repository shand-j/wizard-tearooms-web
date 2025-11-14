# Security Policy

## 🔒 Security Overview

The Wizard Tearoom website project takes security seriously. This document outlines our security practices and how to report security vulnerabilities.

## 🛡️ Security Features

### Static Website Security
- **No server-side vulnerabilities**: Pure static HTML/CSS/JavaScript
- **HTTPS enforced**: All traffic encrypted via GitHub Pages
- **No sensitive data exposure**: No credentials in client-side code
- **CSP-friendly implementation**: Compatible with Content Security Policy headers

### CMS Security
- **Firebase Authentication**: Secure user authentication system
- **Environment-based configuration**: No hardcoded credentials
- **Secure token management**: GitHub Personal Access Tokens with minimal permissions
- **Development mode isolation**: Separate configurations for dev/production

## 🚨 Critical Security Requirements

### Before Production Deployment
1. **Revoke any exposed credentials** immediately
2. **Configure all GitHub repository secrets** properly
3. **Verify Firebase security rules** are restrictive
4. **Test authentication flow** thoroughly
5. **Enable branch protection rules** on main branch

### Repository Secrets Required
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN` 
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`

## 🔍 Security Best Practices

### For Developers
- Never commit real credentials to version control
- Use placeholder values in configuration templates
- Regularly rotate API keys and access tokens
- Review code changes for potential security issues
- Keep dependencies updated

### For Repository Maintainers
- Monitor repository access and permissions
- Enable security alerts for dependencies
- Use branch protection rules
- Audit configuration changes
- Implement proper secret management

## 📢 Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

### What to Report
- Authentication bypasses
- Credential exposure
- Unauthorized access issues
- Injection vulnerabilities
- Configuration security issues

### How to Report
1. **Do not create a public GitHub issue** for security vulnerabilities
2. Contact the repository maintainer directly
3. Provide detailed information about the vulnerability
4. Include steps to reproduce if possible
5. Allow reasonable time for response and fix

### Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix development**: Based on severity
- **Disclosure**: After fix is deployed

## 🔄 Security Updates

This security policy is reviewed and updated regularly. Last updated: November 2025.

## 📚 Additional Resources

- [CMS-README.md](CMS-README.md) - Detailed CMS security setup
- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## ⚖️ Responsible Disclosure

We appreciate security researchers and users who report vulnerabilities responsibly. We are committed to working with security researchers to verify and address any potential vulnerabilities that are reported to us.