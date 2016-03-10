# WebGL-Adventure
It's Web GL time!

This is a project that I started to learn some webgl and javascript.

The current task is to load stl files

You can see my progress at my github pages for this repo(http://alexmerritt.github.io/WebGL-Adventure/).


File List:


Renderer.js - This is the main file where the web gl is being implemnted. Right now it has several classes which include the renderer and a rendering app. The app will feed data to the renderer to create object graphic objects and drawing. There are other objects that make the renderer cleaner.

Model.js - Until I can download and import actual 3d model file formats such as STL I am going to put the model data here.

Shaders.js - This currently holds all of the shader code. Just like the Model.js this is tempory until I have a better way to load shaders.

GLMatrix.min.js - This has gl functions for dealing with matricies, quaterns, and vectors.

index.html - This is were all the javascript files are being called from.