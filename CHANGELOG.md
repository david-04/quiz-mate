# Change Log

## [1.0.0](https://github.com/david-04/quiz-mate/releases/tag/v1.0.0) (UNRELEASED)

- Frontend
  - Display the question and full answers (rather than just the letters) on the player screen
  - Include the average answer speed in the leaderboard
  - Keep answer statistics and the right answer visible when switching between host views
  - New view "Look at your browser" before showing the next question
  - Show the quiz title as the browser tab's document title
  - Display the number of players above the host's question view
  - Simplified the start page by moving all host actions to a separate view
  - Ask for confirmation when leaving or reloading the page while playing or hosting a quiz
  - Removed the ability to limit the number of questions (use the "end quiz" button instead)
  - Removed the ability to switch the language (it now only supports English)
  - Updated the logo, changed some icons and added a link to the GitHub repository
- Backend
  - Added answer speed tracking
  - Serve the frontend's `index.html` directly from the backend server
  - Load frontend assets from the backend server, GitHub, or a custom web server
  - Serve traffic via HTTP and/or HTTPS
  - Use a configuration file for all custom settings
  - Hide the right answer's index when sending questions to players
  - Improved and standardized log messages
- Technical maintenance
  - Removed non-essential dependencies (material-ui, testing-library, react-switch-lang)
  - Upgraded all remaining dependencies to the latest version
  - Switched from NPM to the modern version of Yarn
  - Refactored and restructured the code
  - Addressed SonarQube warnings
