# Change Log

## [1.1.0](https://github.com/david-04/quiz-mate/releases/tag/v1.1.0) (2023-02-26)

- Hide the "Copy URL" button when the browser does not allow copying to the clipboard
- When clicking on the URL, auto-select the whole address including the room code

## [1.0.0](https://github.com/david-04/quiz-mate/releases/tag/v1.0.0) (2023-01-29)

- Frontend
  - Display the question and full answers (rather than just the letters) on the player screen
  - Include the average answer speed in the leaderboard
  - Keep answer statistics and the right answer visible when switching between host views
  - New view "Look at your browser" before showing the next question
  - Reorganized control buttons on the host screen (ordered in the sequence they're used)
  - Show the quiz title as the browser tab's document title
  - Display the number of players (and answers) above the host's question view
  - Simplified the start page by moving all host-related actions to a separate view
  - Ask for confirmation when leaving or reloading the page while playing or hosting a quiz
  - Embedded a sample quiz that can be hosted without uploading a JSON file
  - Removed the ability to limit the number of questions (use the "end quiz" button instead)
  - Removed the ability to switch the language (it now only supports English)
  - Updated the logo, changed some icons and added a link to the GitHub repository
  - Improved validation when loading a quiz
  - Added a "copy URL to clipboard" button to the screen showing joining instructions
  - Display the URL to join on all host screens
- Backend
  - Added answer speed tracking
  - Serve the frontend's `index.html` directly from the backend server
  - Load frontend assets from the backend server, GitHub, or a custom web server
  - Serve traffic via HTTP and/or HTTPS
  - Use a configuration file for custom settings
  - Remove the right answer's index when sending questions to players
  - Improved and standardized log messages
- Technical maintenance
  - Added installation instructions and screenshots to the README
  - Bundled front- and backend into a self-contained NPM package
  - Removed non-essential dependencies (material-ui, testing-library, react-switch-lang)
  - Upgraded all dependencies to the latest version
  - Switched from NPM to the modern version of Yarn
  - Refactored and restructured the code
  - Addressed SonarQube warnings
