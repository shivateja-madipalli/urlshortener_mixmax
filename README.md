# urlshortener_mixmax

###An URL Shortener for MixMax platform using Bitly Shortener API

_How to use it?_

Create a Slash Command with these details

* Name
 * Bitly Shortener

* Command
 * bitly

* Parameter placeholder
 * [URL]

* Typeahead API URL

* Resolver API URL

Once you create the Slash command, write a email with below slash command

`###/bitly [enter the url]`

_example:_ 

/bitly https://shivatejam.com 

will be converted into **http://bit.ly/2hZXQid**

/bitly https://github.com/shivateja-madipalli/urlshortener_mixmax/blob/master/README.md 

will be converted into **http://bit.ly/2hZYtIG**

The whole idea of implementing Bitly shortener is to shorten the URL which will be shared via email as it becomes tedious to share a huge link and many use bitly or similar services.

_Features:_
Reduces the huge URL into a length which will be easily shareable.
A String copied will be converted into an html anchor tag

_Scope for enhancements:_

A help text can be created for the link like, title of the website shared or a piece of info about the link.

A tool box can be populated for editing the link. For example, font, size, color etc.


_Technologies used:_

Node.js, Express 
