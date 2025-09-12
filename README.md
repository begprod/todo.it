# todo.it – another todo app but with features

App for operational planning and decomposition of tasks for 1-4 weeks ahead

![Version](https://img.shields.io/github/package-json/v/begprod/todo.it)
![Last Commit](https://img.shields.io/github/last-commit/begprod/todo.it)
![Issues](https://img.shields.io/github/issues/begprod/todo.it)
![Top Language](https://img.shields.io/github/languages/top/begprod/todo.it)

## Idea

The idea of the application is to transform a text file that I used for planning...

```txt
Monday (date)
- task
- task
- task

Tuesday (date)
- task
- task
- task

Wednesday (date)
- task
- task
- task

Thursday (date)
- task
...
...
...

Backlog
- task
- task
- task
  description
...
```

To the interface, for automatization of calendar generating, history of tasks and backlog for future tasks:

<img src="./public/screenshots/desktop.jpg" alt="todo.it - another todo app but with features" />

## Features

- Automatic calendar generating
- Last 2 month tasks history
- Markdown support (include todo items `- [x] task`)
- Backlog for future tasks
- Create, edit, copy, delete tasks
- Scopes labels for tasks
- Drag'n'drop tasks
- PWA available
- Import/Export data to JSON file
- Works offline

## How data is stored?

For this moment data is stored in local storage of your browser.

## Install application on your device

### iOS

Open the following link on your iPhone or iPad: [https://begprod.github.io/todo.it/](https://begprod.github.io/todo.it/)

Push the button "Share" in the browser menu, then push the button "Add to Home Screen":

![todo.it - another todo app but with features](./public/screenshots/ios.jpg)

### Android

Open the following link on your Android device: [https://begprod.github.io/todo.it/](https://begprod.github.io/todo.it/)

Push the button "Add to Home screen" in the browser menu:

![todo.it - another todo app but with features](./public/screenshots/android.jpg)

## For developers

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Take a look other commands in `package.json`
