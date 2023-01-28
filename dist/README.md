# Quiz Mate

A lightweight self-hosted quiz engine to run interactive real-time quizzes in the browser. This project is a fork of [Quizario](https://github.com/adan2013/Quizario) by Daniel Alberski.

![](https://david-04.github.io/quiz-mate/screenshots/host-guessing-001.png)

Quiz Mate is an easy way to run multiple-choice quizzes in meetings and (video) conferences. The host activates questions one by one. While a question is active, the players can see it and submit guesses in their browser. The host eventually ends the round and can reveal the right answer, display answer statistics and/or show a leaderboard, before moving on to the next question.

The application runs on Node.js and stores all data in memory. It does not require a database or any other infrastructure. There's no authentication or user management either. Everyone can host and join quizzes. 

## Installation and usage

Install the application:

```
npm install quiz-mate
```

Run the Quiz Mate:

```
quiz-mate
```

When started for the first time, a configuration file is created. It's named `quiz-mate.cfg` and contains settings like the HTTP port. Review the generated file and adjust the settings as required. Then start the Quiz Mate again:

```
quiz-mate
```

Once the server is up and running, access the web frontend in the browser:

```
http://localhost:80/
```

The server stores all data in memory. Don't stop or restart it while hosting a quiz. Once the server stops, all active quizzes are terminated and can't be resumed.

When running the Quiz Mate on a local computer, incoming connections are usually blocked by default. To let others access the web server over the internet, open the respective port(s) in the firewall of the DSL router and/or the operating system.

## Screenshots

Quizzes are stored as JSON files. They can be created and edited with the integrated quiz editor:

![](https://david-04.github.io/quiz-mate/screenshots/quiz-editor-001.png)

The quiz editor does not store any quizzes on the server. After creating or modifying a quiz, download and store it locally. Every time the quiz is to be hosted, the JSON file must be uploaded again:

![](https://david-04.github.io/quiz-mate/screenshots/host-upload-quiz-001.png)

Once the quiz has been uploaded, joining instructions are displayed:

![](https://david-04.github.io/quiz-mate/screenshots/host-joining-instructions-001.png)

Participants scan the QR code or enter the URL in their web browser. They join the quiz by picking a nickname and entering the quiz's access code:

![](https://david-04.github.io/quiz-mate/screenshots/homepage-001.png)

After joining a quiz, players see a confirmation in their browser:

![](https://david-04.github.io/quiz-mate/screenshots/player-waiting-for-question-001.png)

When the host starts the quiz, it displays a reminder, asking players to look at their browser:

![](https://david-04.github.io/quiz-mate/screenshots/host-look-at-browser-001.png)

Once the host activates a question, participants can see it and submit guesses by clicking on their chosen answer:

![](https://david-04.github.io/quiz-mate/screenshots/player-guessing-001.png)

After ending the current round, the host can reveal the right answer and show answer statistics:

![](https://david-04.github.io/quiz-mate/screenshots/host-revealing-001.png)

The host can also display the leaderboard at any time:

![](https://david-04.github.io/quiz-mate/screenshots/leaderboard-001.png)

The leaderboard is also displayed on the host's screen when a quiz finishes. Additionally, each player can see their individual result in their own browser:

![](https://david-04.github.io/quiz-mate/screenshots/player-final-result-001.png)

## Limitations

Please be aware of the following limitations:

- The server stores data only in memory. Some quiz data is kept in the host's browser session and not sent to the server at all. This has multiple implications:
  - When the host leaves the quiz, for example by accidentally closing the browser tab, the quiz is terminated. It can't be resumed.
  - Unlike the host, players can re-join a quiz after leaving. However, they won't be able to see the current question. They can only resume participating when the next question is activated.
  - The Quiz Mate can't run in cluster environments like Kubernetes. The host and all players must connect to the same server instance and this instance must remain up and running until the quiz finishes.
- The Quiz Mate does not support authentication or user management. Everyone who can access the web server can host quizzes.
- The server stores quiz data in memory. At the moment, this data is not deleted when a quiz ends. Running the server continuously in a hosting environment might require scheduled restarts from time to time.
- There is no visual indication when a quiz is terminated prematurely. 
  - Players won't get a notification when the host accidentally closes the browser. This aborts the quiz and it can't be resumed. But players will continue to see the "Waiting for the next question" screen.
  - The host does not get any notification when the connection to the backend server drops. This could be caused by an unstable internet connection or the backend server being shut down. Although the quiz might be aborted already, the host's screens behave as if it was still active.
