Real-Time Chat Application with Socket.io

This project implements a fully responsive, real-time chat application using the MERN stack architecture (Node.js/Express/Socket.io for the backend and React for the frontend). It successfully demonstrates bidirectional communication and includes several advanced features as required by the assignment.

Features Implemented

The application successfully covers the Core Chat Functionality and integrates multiple Advanced and Optimization features:

Core Functionality (Task 2)

User Authentication: Simple username-based authentication on the client side.

Global Chat: Default chat room (General).

Messaging: Real-time messages with sender's name and timestamp.

Online Status: Sidebar displays a list of currently active users.

Typing Indicator: Displays a notification when another user in the current room is typing.

Advanced Features (Task 3)

Multiple Chat Rooms/Channels: Users can join and switch between several predefined channels (General, React, Node.js, MERN-Stack).

Private Messaging (PM): Users can click on an online user to initiate a direct, private message.

Message Reactions: Users can click on reactions (👍, ❤️, 😂) displayed under a message, and the reaction count updates in real-time for all users in the room.

Notifications & Optimization (Task 4 & 5)

Real-Time Notifications: System notifications are displayed in the chat log when a user joins or leaves a room.

Sound Notifications: A short beep plays when a new message or system notification is received.

Delivery Acknowledgment: The status of a sent message changes from sending... to Delivered upon successful receipt by the server (using Socket.io callbacks).

Responsive Design: Implemented using Tailwind CSS to ensure a good user experience on both desktop and mobile devices.

Setup Instructions

Prerequisites

Node.js (v18+ recommended)

npm or yarn

1. Backend Setup (server/)

# Navigate to the server directory
cd server

# INSTALL DEPENDENCIES FIRST!
npm install

# Start the server (runs on http://localhost:3001)
npm run dev


2. Frontend Setup (client/)

# Navigate to the client directory
cd client

# INSTALL DEPENDENCIES FIRST!
npm install

# Start the client (runs on http://localhost:5173 by default with Vite)
npm run dev


3. Usage

Open two or more browser tabs to http://localhost:5173.

Enter a unique username in each tab (e.g., 'Alice' and 'Bob').

Observe the real-time online status updates and join notifications.

Switch between the available chat rooms using the sidebar.

Test private messaging by clicking on an online user's name.

Send messages and observe the sending... to Delivered status change.

Click the reaction buttons (👍, ❤️, 😂) beneath a message and watch the count update in the other browser tab.