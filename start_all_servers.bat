@echo off
echo Starting all Museum Backend Servers...

start cmd /k "echo Server 1 (Main/Tickets) starting on Port 3000... && node server.js"
start cmd /k "echo Server 2 (Donations) starting on Port 3001... && node server1.js"
start cmd /k "echo Server 3 (Events) starting on Port 3003... && node server3.js"
start cmd /k "echo Server 4 (Food Court) starting on Port 3005... && node server4.js"

echo All servers are starting in separate windows. 
echo You can now open your browser and go to http://localhost:3000/Hhome.html
pause
