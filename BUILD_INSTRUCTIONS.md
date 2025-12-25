# Building the Android APK

Because this project was initialized in a text-based environment, the native Android scaffolding (Gradle files, Manifest, etc.) might be missing.

## Prerequisites
1.  Node.js installed.
2.  Android Studio & SDK installed.

## Generating the Android Project
If the `mobile/android` folder is missing, run the following in the `mobile` directory:

```bash
cd mobile
npx react-native upgrade
```

This command should generate the necessary `android/` and `ios/` folders.

## Triggering the Build
Once the `mobile/android` folder exists, simply push your changes to the `main` branch.
The GitHub Action defined in `.github/workflows/android-build.yml` will automatically:
1.  Install dependencies.
2.  Build the debug APK.
3.  Upload the APK as an artifact.

## Download the APK
1.  Go to the **Actions** tab in your GitHub repository.
2.  Click on the latest **Android Build** workflow run.
3.  Scroll down to the **Artifacts** section.
4.  Download `app-debug`.
