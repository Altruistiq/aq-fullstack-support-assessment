# Altruistiq Fullstack Support Engineer hiring assessment

Welcome to Altruistiq! Thank you very much for taking the time to do this task. 🙏

### Objective

In this task you'll be debugging an application that consists of a backend and a frontend. 3 bugs have been reported that you need to fix.

**About this application**<br/>
The application backend fetches emission data per year, per country from the [FootPrint Network Api](https://data.footprintnetwork.org/#/api). It transforms the data and exposes it via an api to the frontend.

The frontend fetches the data, and renders an animated chart. It loops through the years, and for each year it shows a sorted chart with emission per country. That way the user can see for every year which country is the highest emitting country!

**Time scope**<br/>
We suggest to not spent more than 2 hours, but you're free to spend more time.

**AI usage**<br/>
We encourage you to _not use AI_; you should be showing of your skills and expertise, not an LLM's. Also in the support role that you're applying for, AI is only of limited use, and strong dependency on AI will stop you from being successful in this role.

However if you choose to use AI we'd like you to be transparent about it and explain how you used it, for example sharing the prompts in the post-mortem, really showing how you use it as a tool to debug or fix cases.

### Get Started

### Install

Clone this repo, then

```bash
cd api && npm i
cd client && npm i
```

### Set env secret

In the `api` folder rename `.env.example` to `.env` and paste the secret that you've received from us.

### Run

Code automatically reloads upon code changes.
The backend runs on port 5010, the frontend runs on http://localhost:5173

```bash
cd api && npm run dev
cd client && npm run dev
```

### Run tests

The client uses Vitest and the api uses Mocha. Code and tests are being watched so automatically reruns.

```bash
cd api && npm test
cd client && npm test
```

# Tasks

Please read through all the tasks to understand the full scope of this assessment.
Make sure to work in a new branch so you can create a PR.

## BUG REPORT 1: Chart is not showing country emissions

When running the frontend, the chart does not render. Instead it throws with an error in the console

```js
Home.vue:124 TypeError: Cannot convert undefined or null to object
    at Function.keys (<anonymous>)
    at Proxy.getData (Home.vue:116:32)
```

Acceptance Criteria:

- Fix when the user loads the app, the chart shows countries and their emissions _immediately_
- Write unit test(s)
- All tests, backend and frontend, should pass
- Write a post mortem explaining what the root cause was and how you approached the fix

## BUG REPORT 2: Chart is not showing all countries

You have fixed showing the frontend, but now it seems the chart shows only 8-10 countries depending on the year (unless you fixed this already with bug 1). Make sure that all countries are shown.

Acceptance Criteria:

- A total of 269 countries and their emissions should be shown _immediately_ when loading the frontend in the browser
- Write unit test(s)
- All tests, backend and frontend, should pass
- Write a post mortem explaining what the root cause was and how you approached the fix

## BUG REPORT 3: Years are not looping

The chart should loop through the years, so when it reaches the final year it should start again at the first year in the data set. But the years keep increasing and never loop back to the first year. This causes the chart to render blank as there is not data for year greater than 2025.

Acceptance Criteria:

- Should loop through years correctly
- When last year in the dataset is rendered, should render the first year again
- Write unit test
- All tests, backend and frontend, should pass
- Write a post mortem explaining what the root cause was and how you approached the fix

# Deliver your result

Please provide a git repository with your code and send us the url.
Your code changes should be in its own branch, and a PR should be created so we can review the changes and run them easily it.
