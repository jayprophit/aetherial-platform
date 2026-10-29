# Imported component capture status

This directory is a reference corpus imported from the predecessor
repositories. It is not wired into the application: the only reference
is the dynamic import in `client/src/integration/ComponentRegistry.ts`,
and that registry names components under the sibling category folders,
not these files.

Two capture defects make some files unusable as source:

- `*.unavailable` - the capture recorded only the sentence
  "Inherited file content will not be shown". There is no code.
- `*.truncated` - the capture was cut off at roughly 16 KB and ends
  with "(Content truncated due to size limit. Use line ranges to read
  in chunks)". The files stop mid-JSX or mid-string.

The suffixes keep the original bytes on disk while removing the files
from the TypeScript include set. Nothing here was reconstructed or
invented. Restoring a component requires recovering its real source.

Counts: 56 unavailable, 29 truncated.

| Status | Original path | Bytes |
| --- | --- | ---: |
| placeholder | `client/src/components/imported/other/_app.tsx` | 40 |
| placeholder | `client/src/components/imported/other/Advanced3DBlockchain.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AdvancedUISystem.tsx` | 40 |
| placeholder | `client/src/components/imported/other/ai-assistant.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AIBusinessAgent.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AIBusinessManagement.tsx` | 40 |
| placeholder | `client/src/components/imported/other/App.tsx` | 40 |
| placeholder | `client/src/components/imported/other/App_1.tsx` | 40 |
| placeholder | `client/src/components/imported/other/App_2.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AuthContext.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AuthContext_1.tsx` | 40 |
| placeholder | `client/src/components/imported/other/AuthModal.tsx` | 40 |
| placeholder | `client/src/components/imported/other/BlockchainFundingPlatform.tsx` | 40 |
| placeholder | `client/src/components/imported/other/Button.tsx` | 40 |
| placeholder | `client/src/components/imported/other/Card.tsx` | 40 |
| placeholder | `client/src/components/imported/other/CascadingMenu.tsx` | 40 |
| placeholder | `client/src/components/imported/other/ContentModeration.tsx` | 40 |
| placeholder | `client/src/components/imported/other/CrossPlatformApp.tsx` | 40 |
| placeholder | `client/src/components/imported/other/CrossPlatformApp_1.tsx` | 40 |
| placeholder | `client/src/components/imported/other/CrossPlatformOptimization.tsx` | 40 |
| placeholder | `client/src/components/imported/other/CurrencyConverter.tsx` | 40 |
| placeholder | `client/src/components/imported/other/Dashboard.tsx` | 40 |
| placeholder | `client/src/components/imported/other/DashboardHome.tsx` | 40 |
| placeholder | `client/src/components/imported/other/DesktopApp.tsx` | 40 |
| placeholder | `client/src/components/imported/other/DeveloperTools.tsx` | 40 |
| placeholder | `client/src/components/imported/other/DigitalAssetLocking.tsx` | 40 |
| placeholder | `client/src/components/imported/other/DigitalAssetManager.tsx` | 40 |
| placeholder | `client/src/components/imported/other/education.tsx` | 40 |
| placeholder | `client/src/components/imported/other/EducationModule.tsx` | 40 |
| placeholder | `client/src/components/imported/other/EducationModule_1.tsx` | 40 |
| placeholder | `client/src/components/imported/other/EnhancedJobsModule.tsx` | 40 |
| placeholder | `client/src/components/imported/other/index.tsx` | 40 |
| placeholder | `client/src/components/imported/other/jobs.tsx` | 40 |
| placeholder | `client/src/components/imported/other/jobs_1.tsx` | 40 |
| placeholder | `client/src/components/imported/other/JobsModule.tsx` | 40 |
| placeholder | `client/src/components/imported/other/kyc-verification.tsx` | 40 |
| placeholder | `client/src/components/imported/other/KYCVerification.tsx` | 40 |
| placeholder | `client/src/components/imported/other/LandingPage.tsx` | 40 |
| placeholder | `client/src/components/imported/other/LoginPage.tsx` | 40 |
| placeholder | `client/src/components/imported/other/main.jsx` | 40 |
| placeholder | `client/src/components/imported/other/MainLayout.tsx` | 40 |
| placeholder | `client/src/components/imported/other/marketplace.tsx` | 40 |
| placeholder | `client/src/components/imported/other/MarketplaceModule.tsx` | 40 |
| placeholder | `client/src/components/imported/other/MobileApp.tsx` | 40 |
| placeholder | `client/src/components/imported/other/NoCodeBuilder.tsx` | 40 |
| placeholder | `client/src/components/imported/other/PageBuilder.tsx` | 40 |
| placeholder | `client/src/components/imported/other/ProfileSettings.tsx` | 40 |
| placeholder | `client/src/components/imported/other/quantum-assistant.tsx` | 40 |
| placeholder | `client/src/components/imported/other/QuantumAssistant.tsx` | 40 |
| placeholder | `client/src/components/imported/other/RegisterPage.tsx` | 40 |
| placeholder | `client/src/components/imported/other/social.tsx` | 40 |
| placeholder | `client/src/components/imported/other/SocialLinksDropdown.tsx` | 40 |
| placeholder | `client/src/components/imported/other/SocialModule.tsx` | 40 |
| placeholder | `client/src/components/imported/other/SpecializedFieldsHub.tsx` | 40 |
| placeholder | `client/src/components/imported/other/StoreBuilder.tsx` | 40 |
| placeholder | `client/src/components/imported/other/TabletApp.tsx` | 40 |
| truncated | `client/src/components/imported/other/AdvancedUISystem_1.tsx` | 16599 |
| truncated | `client/src/components/imported/other/App_3.tsx` | 16626 |
| truncated | `client/src/components/imported/other/App_4.tsx` | 16517 |
| truncated | `client/src/components/imported/other/App_5.tsx` | 16517 |
| truncated | `client/src/components/imported/other/CorePages_2.jsx` | 16503 |
| truncated | `client/src/components/imported/other/CorePages_3.jsx` | 16503 |
| truncated | `client/src/components/imported/other/CrossPlatformOptimization_1.tsx` | 16612 |
| truncated | `client/src/components/imported/other/EcommerceComponents_3.jsx` | 16620 |
| truncated | `client/src/components/imported/other/EcommerceComponents_4.jsx` | 16620 |
| truncated | `client/src/components/imported/other/ElearningComponents_2.jsx` | 16642 |
| truncated | `client/src/components/imported/other/ElearningComponents_3.jsx` | 16642 |
| truncated | `client/src/components/imported/other/EventComponents_2.jsx` | 16564 |
| truncated | `client/src/components/imported/other/EventComponents_3.jsx` | 16564 |
| truncated | `client/src/components/imported/other/EventComponents_4.jsx` | 16564 |
| truncated | `client/src/components/imported/other/EventComponents_5.jsx` | 16564 |
| truncated | `client/src/components/imported/other/ExternalPlatformComponents_2.jsx` | 16580 |
| truncated | `client/src/components/imported/other/ExternalPlatformComponents_3.jsx` | 16580 |
| truncated | `client/src/components/imported/other/GamificationComponents_2.jsx` | 16660 |
| truncated | `client/src/components/imported/other/GamificationComponents_3.jsx` | 16660 |
| truncated | `client/src/components/imported/other/GroupComponents_3.jsx` | 16577 |
| truncated | `client/src/components/imported/other/GroupComponents_4.jsx` | 16577 |
| truncated | `client/src/components/imported/other/index_2.jsx` | 16529 |
| truncated | `client/src/components/imported/other/index_3.jsx` | 16529 |
| truncated | `client/src/components/imported/other/JobMarketplaceComponents_2.jsx` | 16585 |
| truncated | `client/src/components/imported/other/JobMarketplaceComponents_3.jsx` | 16585 |
| truncated | `client/src/components/imported/other/PageBuilder_1.tsx` | 16669 |
| truncated | `client/src/components/imported/other/SocialComponents_2.jsx` | 16644 |
| truncated | `client/src/components/imported/other/SocialComponents_3.jsx` | 16644 |
| truncated | `client/src/components/imported/other/StoreBuilder_1.tsx` | 16558 |
