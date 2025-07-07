
# QuizMania

A dynamic and responsive web-based quiz application built with TypeScript and SCSS. This project allows users to select a topic, answer timed multiple-choice questions, and receive a detailed performance summary.

➡️ [Live Demo](https://dalroy44.github.io/quiz-mania/)

## Key Features

 - Dynamic Quiz Categories: Quizzes are loaded from a JSON file, making
   it easy to add new topics.
 - User Personalization: Greets the user by name on the final score
   screen.
- 10-Second Countdown Timer: Each question has a timer to keep the user
   engaged.
- Immediate Answer Feedback: Users see instantly whether their selected
   answer was correct or incorrect.
- Skip & Exit Options: Users can skip a question or exit the quiz at
   any time.
- Detailed Score Page: A summary screen provides a breakdown of
   performance (correct, incorrect, unanswered) with different feedback
   for high and low scores.
- Responsive Design: The layout adapts seamlessly to desktop, tablet,
- Automated Deployment: Automatically builds and deploys to GitHub
   Pages on every push to the main branch.

## Tech Stack

Frontend: HTML5, SCSS
Logic: TypeScript
Deployment: GitHub Actions & GitHub Pages
Development: Node.js, npm

### Local Development Setup
To run this project on your local machine, follow these steps.

#### Prerequisites

Make sure you have Node.js and npm installed on your system.
Installation

Clone the repository:

git clone https://github.com/dalroy44/quiz-mania.git

Navigate to the project directory:

    cd quiz-mania

Install dependencies:

    npm install

Run the development server:

    npm run dev

This command compiles the code, watches for file changes, and opens the application in your browser with live-reloading.

#### Deployment

This project is configured for continuous deployment. Every push to the main branch automatically triggers the GitHub Actions workflow defined in .github/workflows/deploy.yml. This workflow builds the project and deploys the static files to the gh-pages environment for hosting.

### License

This project is licensed under the MIT License.