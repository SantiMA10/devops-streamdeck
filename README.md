# DevOps Stream Deck

> Check the status of your CI/CD environments using your Stream Deck

- [How it works?](#How-it-works?)
  - [GitHub](#GitHub)
- [Contributing](#Contributing)
- [Issues](#Issues)

# How it works?

## GitHub

### Install this plugin

At the moment this plugin is not published at the Stream Deck Store so you have to download the repo as a ZIP and follow [the instructions the el gato provides here](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/).

### Get you Personal Token

You have to create a new [Personal Token](https://github.com/settings/tokens) with the following scopes: **repo:status**, **repo_deployment** and **public_repo**.

![image](https://user-images.githubusercontent.com/7255298/76707971-b819b500-66f3-11ea-8392-84ee9bb67deb.png)

### Configure your action

Once you have the action available you only have to add your GitHub Personal Token and the URI of the repo you want to monitor following the schema username/reponame.

![image](https://user-images.githubusercontent.com/7255298/76708059-49892700-66f4-11ea-9521-70fea46a0d80.png)

# References

- [Steam Deck SDK docs](https://developer.elgato.com/documentation/)

# Contributing

Thank you for considering contributing to the **DevOps for Stream Deck**. Feel free to send in any pull requests

# Issues

Please report any [issues](https://github.com/SantiMA10/devops-streamdeck/issues). Ideas for new excuse features are also welcomed.
