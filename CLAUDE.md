# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
## app description
- this app is an ai cooking assistant that considers the user's prefrences then suggestses a list of options fot he user. after the user selects a recipe either by uploading a picture of avalivable ingredients. it hsould use an ai or ML model to macth the user to the best recipe. when the user wants to start a recipe the app will have a live ai model that will coacth the user thourgh out the process by giving them step by step instructions and asking user for more information when needed and wating for user input to confirm when a step has been completed. i plan to build the voice ai using livekit and the google gemini api. 
## Build Commands
- `npm run start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser
- `npm run test` - Run Jest tests (ExampleApp)
- `npm test -- -t "testName"` - Run specific test

## Code Style Guidelines
- **TypeScript**: Use strict type checking. Define interfaces/types for props and state.
- **Component Structure**: Functional components with hooks. Export default for main components.
- **Styling**: StyleSheet.create() for styles. Theme-based styling using useThemeColor hook.
- **Imports**: Group imports (React, third-party, local). Use absolute imports with @ prefix.
- **Naming**: PascalCase for components, camelCase for variables/functions.
- **Error Handling**: Use try/catch blocks for async operations.
- **File Structure**: Components in dedicated folders with related files (tests, styles).
- **Testing**: Jest with react-test-renderer for snapshot testing.

## user  preference
- when any action for any feature is taken create a document that explains what was done and go into deatils on how it was done and why it was done that way so that the user can fully understand the change and learn from it make the document like you are a teacher using the code as an example to teach cocncepts and code style, when any future change relating to any feature with an exsisting feature document is made just add  add any new details to the previuously created feature file