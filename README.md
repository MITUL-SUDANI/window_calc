# Window Dimension Calculator

A mobile-first, offline-capable Progressive Web App (PWA) designed for window fabricators to quickly calculate shutter and glass dimensions.

## Features
- **Offline Functionality**: Works without an internet connection using Service Workers.
- **PWA Ready**: Can be installed on mobile devices for a native app-like experience.
- **Customizable Formulas**: Adjust formulas for different window types (e.g., 40mm, 60mm, Sliding, Openable) and save them locally.
- **Base-8 Arithmetic**: Handles window measurements in units and subunits (1 unit = 8 subunits).
- **Mobile-First Design**: Optimized for small screens with side-by-side inputs and a clean header.
- **Input Locking**: Prevents accidental changes to inputs once a calculation is made.

## How to Use
1. **Enter Dimensions**: Select the window Type and Subtype, then enter the Height and Length.
2. **Calculate**: Press the "Calculate" button to see the results categorized by Shutter, Glass, and Frame.
3. **Locking**: Inputs are disabled once results are shown.
4. **Clear**: Press the "Clear" button to reset the form and unlock the inputs for a new measurement.
5. **Customize**: Click the gear icon in the header to modify the formulas for any window type.

## Technical Details
- **Build with**: Vanilla HTML, CSS, and JavaScript.
- **Storage**: User-defined formulas are stored in the browser's `localStorage`.
- **Offline**: Assets are cached using a Service Worker.

## Deployment
This app is designed to be hosted on **GitHub Pages**.