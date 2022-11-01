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
10. Generate the "private.key" and "public.key" files through the secret word saved in the ".env". For demonstration purposes the secret word "foobar" will be used.
11. Create the folder "certs".
12. Run the comanda: `openssl genrsa -aes128 -passout pass:foobar -out private.key 512`
13. Run the comanda: `openssl rsa -in private.key -passin pass:foobar -pubout -out public.key`
14. Move the "private.key" and "public.key" files to the "certs" folder.
15. Run `npm run dev` to run the project in development mode.
16. Run `npm run build` to compile the project.
17. Run `npm start` to run the project in production mode.