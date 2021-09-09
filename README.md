# Frappe Chat

Modern Chat application for the frappe ecosystem

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Before installation](#before-installation)
  - [How to install](#how-to-install)
- [Usage](#usage)
- [License](#license)

## Features

1. Intuitive and modern UI/UX
2. REST architecture
3. Very lightweight
4. Mobile First
5. Guest and Admin view
6. All functionalities of a chat app

## Installation

### Before installation

It is important to delete all the deprecated doctypes of the existing chat application in the framework.

To accomplish that, you have to delete all the doctypes which has the prefix **chat**.

After this step is completed, you can process to install the application.

### How to install

1. Get the app from the repository.

   ```
   $ bench get-app chat https://github.com/codescientist703/frappe_chat
   ```

2. Install the app on your site.
   ```
   $ bench --site your-site.local install-app chat
   ```

## Usage

1. On the portal pages, the guest will be prompted with this view.
   ![Welcome View](images/welcome-screen.png)

2. The guest will have to fill a form and after that they will be prompted to the chatting space.
   ![Form View](images/guest-form-fill.gif)

3. You can click the message icon on the navbar to open the chat admin view.
   ![Guest View](images/admin-view.gif)
4. Click on any room and start chatting right away.
   ![Admin Chat](images/admin-chat.gif)

5. Create any private room and add users to it.
   ![New Room](images/new-room.gif)

## License

MIT
