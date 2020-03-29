# DevOps for Stream Deck

> Check the status of your CI/CD environments using your Stream Deck

- [How it works?](#how-it-works)
  - [Install this plugin](#install-this-plugin)
  - [Configuration options](#configuration-options)
  - [Get you Personal Token](#get-you-personal-token)
    - [GitHub](#github)
    - [GitLab](#gitlab)
    - [Netlify](#netlify)
- [References](#references)
- [Contributing](#contributing)
- [Issues](#issues)

# How it works?

## Install this plugin

You can find it at the Stream Deck Store. 🚀

## Configuration options

| Field                    | Description                                                                                                              | Required |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| `account`                | Here you can select your [Personal Token](#get-you-personal-token) and custom `domain` if you use a self-hosted version. | Yes      |
| `username/repo`/`siteId` | Configure here the repo for GitLab/GitHub or the site id for Netlify                                                     | Yes      |
| `branch`                 | Select the branch to monitor or leave it empty to show info from all branches.                                           | No       |

## Get you Personal Token

### GitHub

You have to create a new [Personal Token](https://github.com/settings/tokens) with the following scopes: **repo:status**, **repo_deployment** and **public_repo**.

![image](https://user-images.githubusercontent.com/7255298/76707971-b819b500-66f3-11ea-8392-84ee9bb67deb.png)

### GitLab

You have to create a new [Personal Token](https://gitlab.com/profile/personal_access_tokens) with the following scope: **api**.

![image](https://user-images.githubusercontent.com/7255298/76709422-dd5ff080-66fe-11ea-980a-91b164b5c283.png)

### Netlify

#### Personal Token

You have to create a new [Personal Token](https://app.netlify.com/user/applications#personal-access-tokens).

#### Site ID

You can find your site id in the settings tab of your project, with the **API ID** name.

# References

- [Steam Deck SDK docs](https://developer.elgato.com/documentation/)

# Contributing

Thank you for considering contributing to the **DevOps for Stream Deck**. Feel free to send in any pull requests

# Issues

Please report any [issues](https://github.com/SantiMA10/devops-streamdeck/issues). Ideas for new excuse features are also welcomed.
