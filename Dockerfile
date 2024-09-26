# Step 1: Use a Node.js base image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 3000

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Step 8: Build the TypeScript code for production 
RUN if [ "$NODE_ENV" = "production" ]; then npm run prod; fi

# Step 9: Run different commands based on the environment
CMD if [ "$NODE_ENV" = "development" ]; then npm run start; else node ./lib/app.js; fi
