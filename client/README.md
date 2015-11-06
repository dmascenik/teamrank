Setup:
- Install Node and npm
- Install gradle
- Run "npm install"

Building:
- Don't call npm directly, use gradle
- Tasks:
  - gradle clean - Deletes the build directory (if you want, delete the node_modules dir manually)
  - gradle build - Full build with testing and coverage analysis
  - gradle run - Launches the app with a mocked backend at localhost:8080
