## Welcome to PostIt

Good day! The given application is a simple blog website where users can create, update, delete, and comment on blog posts. To have the application work on your device, please run the following codes below. Please note that to access the database, the [docker tool](https://www.docker.com/products/docker-desktop/) is required.

```terminal
cp .env.example .env
docker compose up -d
npm install
npx prisma generate
npm run dev
```

The website will then run on [http://localhost:3000](http://localhost:3000) with your browser to show the result.

Alternatively, you can access the online/deployed version of this website [here](https://postit-ashy.vercel.app/)! Please note that the online version may suffer from longer load times either due to slow internet speed or simply due to the performance of the free tier of a Vercel/Aiven-deployed website. The local version is much faster.


## PostIt's Functions

PostIt has the following main functions:

- Login - Only users with a username in the database can log in to the website. The following are the currently approved usernames:
    - scarletsky
    - DreaminShu
    - boppinID

- Posts Page - The main page that shows all of the posts in the website. Can be filtered to show only the current user's posts or all posts in the database.

- View Post Details - Can be accessed by clicking on a post card from the dashboard. All users can comment on them, but only the author can edit/delete the post itself.

- Add Post - Can be accessed from the dashboard. Creates a new post. The following are constraints during creation:
    - Title must be 1-50 characters long
    - Summary must be 1-100 characters long
    - Content must at least be 1 character long
    - If Thumbnail URL is invalid, the default thumbnail will be used

- Edit Post - Can be accessed on a post's details page by its author. Previous constraints still apply.

- Delete Post - Can be accessed on a post's details page by its author. Also deletes all comments related to the post.

- Add Comment - Adds a comment on the post's details page.

- Delete Comment - Allows the post's author to delete any comment on their post's page.

- Logout - Logs the user out of the website and deletes the current session
