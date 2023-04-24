# Aashraya

**Important**

*The frontend and the backend of Aashraya are entirely separated and are kept in different repositories for modularity and scalability.*
*This is the Frontend of the Aashraya app. It is written using React Js and is hosted on Netlify.*
*Backend Part is written in Django Rest Frameworkf and is hosted on Heroku.*
# [Go to the Backend](https://github.com/Kaushal-Dhungel/aashraya)

**Update**
*Since, Heroku discontinued it's free tier feature, the backend of this site is no longer live and can not be accessed. Hence, I have uploaded a video on YouTube showing how this works locally. The video is available here:-https://youtu.be/hvudECwNHUA*


## About

![main img](https://github.com/Kaushal-Dhungel/aashraya/blob/master/thumbnails/th.png)

[Click here to visit the app](https://aashraya.netlify.app/) (This doesn't work anymore.)

Aashraya is a web platform to search for rooms, hostels,apartments,homes,lands and roommates.
Users can also advertise their properties, or themselves as roomies.

The landing page has a search box with autocomplete that allows users to input a location and see all of the properties that are available in that area. 
The user can get a detailed description of each property as well as its position on the map by clicking the "see details" button. 
If the user is logged in, she can add the property to her cart.

A user can also list her properties, but she must first register. 
Once registered, the user is given a profile page where she may update information such as her phone number and email address so that if she offers her properties, 
clients can easily contact her. If the user is looking for a roommate, she can do so as well, or she can list herself so that others can discover her.


## Project Structure

`src` folder contains all the project code. There are six folders inside of it:-
- components :- all the general components related to app like registration, Navbar etc.
- items :- components related to properties like rooms, apartments etc.
- roommates :- components related to roommates.
- profile :- components related to users profile.
- store:- state management using Redux, here used for performing the authentication operation.
- imgs :- holds all the images and SVGs.

**This is not an open source project hence no installation guide is provided.**