
# Overview

This is the code base for the HEAL Data Fair website. healdatafair.org

## Requirements

Node/npm

## Installation Generic


# Next frontend

This frontend relies on Next's [Static Generation](https://nextjs.org/docs/basic-features/pages) using [Strapi](https://strapi.io/) as the data source. Make sure Strapi is running in parallel when you run this app.

## Routes

**pages/[[...slug]].js**

This file generates all the app's route. First, it fetches all the pages entries in Strapi. Then, it creates one route per page found. These routes can look like this:

- yoursite.com
- yoursite.com/page
- yoursite.com/page/nested/route

Notice that the path of the page can be several layers deep, or it can be the root of the site. This is possible thanks to Next's [optional catch-all routes](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes).

To see how to build these nested routes, see [the Strapi project's Readme](../backend/README.md).

## Available Scripts

In the project directory, you can run:

**`yarn dev`**

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any errors in the console.

**`yarn build`**

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

**`yarn start`**

Starts the application in production mode.
The application should be compiled with \`next build\` first.

See the section in Next docs about [deployment](https://nextjs.org/docs/deployment) for more
information.

## Database (postgres used by strapi)

Hosted on AWS with 4 days of database backup

# Administration Manual (Super Admins)
* Super Admins must be signed in and approved as Super Admins
* Once approved you can sign in here https://api.healdatafair.org/admin

## Creating a page

1. Under COLLECTION TYPES on the left hand navigation panel choose "Pages"
2. On the top right hand corner click the Add New Pages button

Fill in the required fields for 
* ShortName (Page Name)
* MetaTitle (The text that is displayed on search engine result pages and browser tabs to indicate the topic of a webpage.)
* MetaDescription (An HTML element that describes and summarizes the contents of your page for the benefit of users and search engines)
* ShareImage (Select an existing image or upload your own)
* Status (Set to draft by default, in order to make the page live set this to published)
* Slug (Here enter the slug that you would like to point to the new webpage you are creating. Example: If you enter the word "about", your new page will be found at https://healdatafair.org/about. Make sure the same slug is not used across multiple pages. You can also extend the slug by prefixing the chosen slug with a directory name and a forward slash. Example: If you enter "resources/about" the new page will be found at https://healdatafair.org/resources/about. )

Though your page is now correctly configuered. It will not be avaliable until content sections have been added.

3. Click the + button that will say ADD TO CONTENTSECTIONS when you hover above it.
A box will open up that instructs you to Pick one component.
Under Sections click on the desired component and once you have filled out the neccessary information for the chosen component or components if you are adding more than one, click the green save button on the top right hand corner of the page. Your page will not go live if you do not click save.
More about individual components can be found below.

## Sections/Components
Fill in the desired options for the chosen component

1. Page Heading 
* Title (Title of page)
* Optionaldescription (Descriptive text to say a little more about the page)

Example of this component can be seen at the top of the resources page https://www.healdatafair.org/resources

## Editing a page

To edit a page 

1. Under COLLECTION TYPES on the left hand navigation panel choose "Pages"
2. Click any of the existing pages
3. Make edits to existing sections/components. You can also delete existing sections/components or add new ones. 
4. Once you have made your required changes click the green save button on the top right hand corner. 

## Adding events to the heal calendar
### In the Heal outlook calendar 

To create a webinar event

1. Select the purple category tag when creating the event.
2. Done

To create a public event

1. Leave the category tag with no selection.
2. Done

## Editing a Collective Board Member

In order to not send a welcome email after any edit.

1. Switch the PreviouslyConfirmed button to on.
2. Save
3. Make desired changes
4. Save

## Creating a public collective board meeting

In the HEAL outlook calendar

1. Create a new meeting
2. On the meeting header search for the category tag
3. Choose green category
4. Save

## Creating an announcement type meeting

In the HEAL outlook calendar

1. Create a new meeting
2. On the meeting header search for the category tag
3. Choose yellow category
4. Save

# For Developers

## Local Deployment

1. Clone the repo
2. run npm install
3. create a .env.local file by copying the .env.local.example file found in the root folder
4. Add the correct values to each variable in that env file (You can get these from your manager.)
5. run npm install 
6. run npm run dev
7. The application should be avaiable at localhost:3000

## Deployment

Heal is currently set up for automatic deployment through AWS.
Any merges into the main branch on github will trigger the rebuild.
The same applies for the staging build. 

### Content Update Deployments

1. Through the content manager or Backend Content API make your neccessary changes and make sure to save and publish.
2. Once your updates have been made go to GENERAL > Settings > Webhooks
3. Now find the webhook titled staging. (Note: This webhook should be enabled by default and if it is enabled there are no further steps to take. After your content changes were saved it would have automatically triggered a rebuild of the staging site.)
4. After 15 minutes check that your new updates are showing up as they should on the staging site and once they are approved head back to GENERAL > Settings > Webhook.
5. Find the webhook titled main and click into it. (Always leave it disabled)
6. On the top right hand corner find the button that says "Trigger". This will trigger a rebuild of the production side.
7. Wait 15 minutes and confirm that your changes have been applied to the production site.

## Workflow/Development

1. Create a new branch off of the staging branch and name it after the github issue the task belongs to. example. issue/46/navbar-links-fix
2. All commits should be given a short description of what was done and why. Example: The external links component was opening on the same page, added target blank to open a new tab.
3. When completed push up your new branch to the github repository.
4. If this is a feature that needs approval by other team members follow these steps to deploy your branch.
* Sign into AWS
* Go to deployments
* Find your branch and hit deploy
* Make note of the link created so that you can share it 
5. Create a PR and tag the content team owner and two developers for code review.
6. Never merge a PR until the code has been approved and the owner of the new feature gives us the green light to push into production.
7. After approved and merged into staging, check the staging build to make sure everything looks good.
8. Once staging is approved, create a PR to the main branch and notify the team that it is ready.