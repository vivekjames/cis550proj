# CIS 450 Final Project 
Names: Maria Tu, Yu Yeon (Julie) Lee, Vivek James, Jonathan Cheng 
Group 45 

# Overview 
Our platform, Spotify Wrapped 450, to provide an in-depth analysis of a user's listneing habits, which is why we also have features that allow a user to compare his/her music preferences to the greater trends of the music industry and functionalities that give a user personalized music recommendations. 

Here is a breakdown of the pages that are available on our platform - 

Home Page: 
This is our welcome/landing page, where the user will paste in a link to a personal playlist they enjoy listening to.  

Analysis Page: 
This page is similar to the information presented in the Spotify Wrapped. It will present the user with information about the music in the playlist, such as energy levels, loudness, liveness, and acousticness. It will also allow the user to select a particular attribute, say ‘Energy’, and receive information on the average energy, maximum energy level, and minimum energy level within the playlist. The user will also be able to see what the top genre within their playlist is. 

Trends Page: Our trends page will offer insights tied to both the user’s playlist and Billboard’s top charting songs, allowing the user to see whether their song preferences are reflected in the music industry’s trends. It will display the maximum time a track from the playlist has spent on the charts, the average peak rank on the charts per genre present in the playlist, gets all artists with music that correspond to user-inputted levels of danceability and energy, and a list of songs that appear on both the user’s playlist and Billboard’s charts. 

Recommendations Page: 
Our recommendations page offers a variety of recommendations to the user based on their playlist information. One functionality allows the user to select an energy level, genre, acousticness, danceability, earliest year of release, and latest year of release and returns songs that correspond to this query. In another feature, given a user inputted song, gives songs that have the same energy (1 degree connection), are within .005 energy (2 degree connection) and are within .008 energy (3 degree connection). The final functionality returns suggested artists based on similar accousticness, danceability, and energy of the user’s playlist.


# How to Run 
Open two terminals. 'cd client' into one and 'cd server' into another. 'npm install' if necessary, then run 'npm start' in both. The application should be running in https://www.localhost3000.org/ 



