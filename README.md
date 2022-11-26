<br>
<div align="center">
<img width="150" alt="logotype" src=".github/images/logo.png">
</div>
<br>

# Frappe Chat

![UI Tests](https://github.com/frappe/chat/actions/workflows/ui-tests.yml/badge.svg)

Modern Chat application for the Frappe ecosystem.

Supports Frappe version 13 and develop.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

1. Intuitive and modern UI/UX
2. REST architecture
3. Very lightweight
4. Mobile First
5. Guest and Admin view
6. Dark mode support
7. All functionalities of a chat app

## Installation

1. Get the app from the repository.

   ```
   bench get-app chat
   ```

2. Install the app on your site.
   ```
   bench --site your-site.local install-app chat
   ```

## Usage

1. On the portal pages, the guest will be prompted with this view.

   ![Welcome View](.github/images/welcome-screen.png)

2. The guest will have to fill a form and after that they will be prompted to the chatting space.

   ![Form View](.github/images/guest-form-fill.gif)

3. You can click the message icon on the navbar to open the chat admin view.

   ![Guest View](.github/images/admin-view.gif)

4. Click on any room and start chatting right away.

   ![Admin Chat](.github/images/admin-chat.gif)

5. Chat with any user on the site.

   ![Direct Room](.github/images/direct-room.gif)

6. Create any private room.

   ![New Room](.github/images/new-room.gif)

7. You can configure the required application settings in chat settings doctype.

   ![Chat Settings](.github/images/chat-settings.png)

## License

MIT
