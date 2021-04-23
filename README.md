# DevOps for Stream Deck <!-- omit in toc --> ![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Felgatostore-badge.herokuapp.com%2F%3Fidentifier%3Ddev.santiagomartin.devops)

> Check the status of your CI/CD environments using your Stream Deck

- [How it works?](#how-it-works)
  - [Install this plugin](#install-this-plugin)
  - [Configuration options](#configuration-options)
  - [Compatible services](#compatible-services)
    - [GitHub](#github)
      - [For public repositories](#for-public-repositories)
      - [For public/private repositories](#for-publicprivate-repositories)
    - [GitLab](#gitlab)
    - [Netlify](#netlify)
    - [Vercel](#vercel)
    - [Travis-CI.com / Travis-CI.org](#travis-cicom--travis-ciorg)
- [How to setup the dev environment](#how-to-setup-the-dev-environment)
  - [Project structure](#project-structure)
- [References](#references)
- [Contributing](#contributing)
- [Support the project](#support-the-project)
- [Issues](#issues)

# How it works?

## Install this plugin

You can find it at the Stream Deck Store. 🚀

## Configuration options

| Field           | Description                                                                                                              | Service                                 | Required |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | -------- |
| `account`       | Here you can select your [Personal Token](#get-you-personal-token) and custom `domain` if you use a self-hosted version. | GitHub, GitLab, Netlify, Vercel, Travis | Yes      |
| `username/repo` | Configure here the repo for GitLab/GitHub                                                                                | GitHub, GitLab, Travis                  | Yes      |
| `siteId`        | Your [Netlify Site Id](#site-id)                                                                                         | Netlify                                 | Yes      |
| `project name`  | Your project name in Vercel                                                                                              | Vercel                                  | Yes      |
| `branch`        | Select the branch to monitor or leave it empty to show info from all branches.                                           | GitHub, GitLab, Netlify, Travis         | No       |

## Compatible services

### GitHub

<details>
 <summary>Show information</summary>

 #### For public repositories

You have to create a new [Personal Token](https://github.com/settings/tokens) with the following scopes: **repo:status**, **repo_deployment** and **public_repo**.

![image](https://user-images.githubusercontent.com/7255298/76707971-b819b500-66f3-11ea-8392-84ee9bb67deb.png)

#### For public/private repositories

You have to create a new [Personal Token](https://github.com/settings/tokens) with all the repo scopes, otherwise you don't have access to your private repositories.

![image](https://user-images.githubusercontent.com/7255298/109531364-17650680-7ab8-11eb-8172-bd658820f5da.png)


</details>

### GitLab

<details>
 <summary>Show information</summary>

You have to create a new [Personal Token](https://gitlab.com/profile/personal_access_tokens) with the following scope: **api**.

![image](https://user-images.githubusercontent.com/7255298/76709422-dd5ff080-66fe-11ea-980a-91b164b5c283.png)

</details>

### Netlify

<details>
 <summary>Show information</summary>

#### Personal Token <!-- omit in toc -->

You have to create a new [Personal Token](https://app.netlify.com/user/applications#personal-access-tokens).

#### Site ID <!-- omit in toc -->

You can find your site id in the settings tab of your project, with the **API ID** name.

</details>

### Vercel

<details>
 <summary>Show information</summary>

You have to create a new [Token](https://vercel.com/account/tokens).

</details>

### Travis-CI.com / Travis-CI.org

<details>
 <summary>Show information</summary>

You have to create a new [Token](https://developer.travis-ci.com/authentication).

By default the actions uses the **travis-ci.org** api, if you want to use it with **travis-ci.com** set https://api.travis-ci.com as domain in the configuration.

</details>

# How to setup the dev environment

1. Install all the dependencies

```bash
yarn
```

2. Build the project for the first time, the project uses [Parcel as bundler](https://parceljs.org/) to handle React and TypeScript

```bash
yarn build
```

3. Create a symlink form the folder you clone the repository

```
ln -s devops-streamdeck/dist/dev.santiagomartin.devops.sdPlugin ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/dev.santiagomartin.devops.sdPlugin
```

1. Run the proper dev command, since we are using Parcel to build the project we have a few dev commands to start Parcel in watch mode

```
// For Property Inspector
yarn:dev:pi

// For Plugin
yarn:dev:plugin

// For setup screen, where the user add the configuration for each service
yarn:dev:setup
```

## Project structure

    .
    ├── node_modules
    ├── dist
    ├── images
    ├── node_modules
    ├── release
    ├── src
      ├── dev.santiagomartin.devops.sdPlugin
        ├── pi // all code related with Property Inspector (build with React and TypeScript)
        ├── plugin // all code related with Plugin (build with TypeScript)
        ├── setup // all code related with Setup page (build with React and TypeScript)
    ├── tools // contains the elgato tools to build the project using GitHub Actions
    ├── .babelrc
    ├── .gitignore
    ├── jest.config
    ├── LICENSE
    ├── manifest.json
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    └── yarn.lock

# References

- [Steam Deck SDK docs](https://developer.elgato.com/documentation/)

# Contributing

Thank you for considering contributing to the **DevOps for Stream Deck**. Feel free to send in any pull requests.

# Support the project

If you like the project, you can subscribe to my [Twitch channel](https://twitch.tv/santima10), where I do live coding of this and other projects.

# Issues

Please report any [issues](https://github.com/SantiMA10/devops-streamdeck/issues). Ideas for new excuse features are also welcomed.
