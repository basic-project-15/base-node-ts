# Base-Node-TS

## Steps to follow
1. Clone the project.
2. Use the program nvm.
3. Install the "editorconfig" plugin.
4. Install the "prettier" plugin.
5. Install the "eslint" plugin.
6. Choose prettier as the primary formatter for .js, .jsx, .ts, and .tsx files.
7. Activate automatic formatting when saving Visual Studio Code.
8. Add `.env` file.
9. Run `npm i` to install dependencies.
10. Generate the "private.key" and "public.key" files through the secret word saved in the ".env". Add a value to the `JWT_PASSPHRASE` environment variable.
11. Run `npm run generate-token-keys` to generate token keys.
12. Run `npm run dev` to run the project in development mode.
13. Run `npm run build` to compile the project.
14. Run `npm start` to run the project in production mode.