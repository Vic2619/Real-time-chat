##### Realtime Chat Application Setup Guide

###### Step 1: Download the Project



Download or clone the project:

git clone https://github.com/Vic2619/Real-time-chat#



###### Step 2: Open the Project Folder



Open terminal inside the project folder:

*cd Realtime chat*



###### Step 3: Start Docker Desktop



Install Docker Desktop before running the project.



1\. Download Docker Desktop:

*https://www.docker.com/products/docker-desktop/*



2\. Install Docker Desktop.



3\. Open Docker Desktop and wait until Docker is running.



4\. Continue with the setup instructions.



###### Step 4: Find Your Local IP Address



Open Command Prompt and run: *ipconfig*



Find your IPv4 Address.



Example: 10.170.210.122



###### Step 5: Configure Client/.env



Open: Client/.env



Replace the content with: VITE\_API\_URL=http://YOUR\_LOCAL\_IP:5000



Example: VITE\_API\_URL=http://10.170.210.122:5000



###### Step 6: Run Docker Containers



Open terminal in the project root folder and run:

*docker compose up --build*



Wait until all containers finish starting.



###### Step 7: Open the Website



Open browser and access: *http://localhost:5173/*



###### Step 8: Register and Login



1. Create an account.

2. Login using the created account.

3. Start chatting.



###### **Multi-Device Usage**



To use the application on another device:



1. Connect all devices to the same WiFi or hotspot.

2. Open browser on another device.

3. Access: *http://YOUR\_LOCAL\_IP:5173*

Example: *http://10.170.210.122:5173*



###### **Stop the Application**



To stop Docker containers: *docker compose down*

